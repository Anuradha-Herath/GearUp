package com.autoserve.service;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.Employee;
import com.autoserve.entity.User;
import com.autoserve.entity.Vehicle;
import com.autoserve.repository.AppointmentRepository;
import com.autoserve.repository.EmployeeRepository;
import com.autoserve.repository.TimeLogRepository;
import com.autoserve.repository.UserRepository;
import com.autoserve.repository.VehicleRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final AppointmentRepository appointmentRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final TimeLogRepository timeLogRepository;

    public ReportService(AppointmentRepository appointmentRepository,
                         EmployeeRepository employeeRepository,
                         UserRepository userRepository,
                         VehicleRepository vehicleRepository,
                         TimeLogRepository timeLogRepository) {
        this.appointmentRepository = appointmentRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.timeLogRepository = timeLogRepository;
    }

    /**
     * Build a small analytics map used by the controller for exports and charts.
     * Keys: totalAppointments, statusCounts, totalRevenue, dailyCounts, rows
     */
    public com.autoserve.dto.report.AppointmentAnalyticsDto buildAppointmentAnalytics() {
        return buildAppointmentAnalytics(null, null, null);
    }

    /**
     * Build appointment analytics with optional filters.
     * startDate and endDate are inclusive. statusFilter if non-empty will filter by status (case-insensitive).
     */
    public com.autoserve.dto.report.AppointmentAnalyticsDto buildAppointmentAnalytics(java.time.LocalDate startDate, java.time.LocalDate endDate, String statusFilter) {
        // Prefer repository-level filtering for performance. Fall back to findAll() when no filters provided.
        List<Appointment> appointments;
        String sFilter = statusFilter != null && !statusFilter.isBlank() ? statusFilter.trim() : null;
        if (sFilter != null) {
            // normalize common stored statuses to upper case (most statuses are stored in upper-case)
            sFilter = sFilter.toUpperCase();
        }

        if (startDate != null && endDate != null) {
            if (sFilter != null) {
                appointments = appointmentRepository.findByDateBetweenAndStatusIgnoreCase(startDate, endDate, sFilter);
            } else {
                appointments = appointmentRepository.findByDateBetween(startDate, endDate);
            }
        } else if (startDate != null) {
            if (sFilter != null) {
                appointments = appointmentRepository.findByDateGreaterThanEqualAndStatusIgnoreCase(startDate, sFilter);
            } else {
                appointments = appointmentRepository.findByDateGreaterThanEqual(startDate);
            }
        } else if (endDate != null) {
            if (sFilter != null) {
                appointments = appointmentRepository.findByDateLessThanEqualAndStatusIgnoreCase(endDate, sFilter);
            } else {
                appointments = appointmentRepository.findByDateLessThanEqual(endDate);
            }
        } else if (sFilter != null) {
            appointments = appointmentRepository.findByStatusIgnoreCase(sFilter);
        } else {
            appointments = appointmentRepository.findAll();
        }

        appointments = appointments == null ? Collections.emptyList() : appointments;

        long total = appointments.size();
        Map<String, Long> statusCounts = appointments.stream()
                .collect(Collectors.groupingBy(a -> a.getStatus() == null ? "UNKNOWN" : a.getStatus(), Collectors.counting()));

        double totalRevenue = appointments.stream()
                .mapToDouble(a -> a.getEstimatedCost())
                .sum();

        Map<String, Long> daily = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter fmt = DateTimeFormatter.ISO_DATE;
        for (int i = 29; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            String key = d.format(fmt);
            long cnt = appointments.stream().filter(a -> d.equals(a.getDate())).count();
            daily.put(key, cnt);
        }

        java.util.List<com.autoserve.dto.report.AppointmentRowDto> rows = appointments.stream().map(a -> {
            com.autoserve.dto.report.AppointmentRowDto r = new com.autoserve.dto.report.AppointmentRowDto();
            r.setId(a.getId());
            r.setDate(a.getDate() != null ? a.getDate().toString() : null);
            r.setTime(a.getTime() != null ? a.getTime().toString() : null);
            r.setStatus(a.getStatus());
            r.setEstimatedCost(a.getEstimatedCost());
            User cu = a.getCustomer();
            r.setCustomerEmail(cu != null ? cu.getEmail() : null);
            User eu = a.getEmployee();
            r.setEmployeeEmail(eu != null ? eu.getEmail() : null);
            r.setServiceId(a.getService() != null ? a.getService().getId() : null);
            Vehicle v = a.getVehicle();
            r.setVehicleNumber(v != null ? v.getVehicleNumber() : null);
            r.setAdditionalNote(a.getAdditionalNote());
            return r;
        }).collect(Collectors.toList());

        return new com.autoserve.dto.report.AppointmentAnalyticsDto(total, statusCounts, totalRevenue, daily, rows);
    }

    /**
     * Build simple employee performance analytics.
     */
    public Map<String, Object> buildEmployeeAnalytics() {
        return buildEmployeeAnalytics(null, null);
    }

    public Map<String, Object> buildEmployeeAnalytics(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        List<Employee> employees = employeeRepository.findAll();
        List<Appointment> all = appointmentRepository.findAll();
        List<Employee> employeeList = employees == null ? Collections.emptyList() : employees;
        List<Appointment> appointmentList = all == null ? Collections.emptyList() : all;

        // Apply optional date filtering to appointmentList into a separate variable to keep appointmentList effectively final
        final java.time.LocalDate sd = startDate;
        final java.time.LocalDate ed = endDate;
        final List<Appointment> filteredAppointments;
        if (sd != null || ed != null) {
            filteredAppointments = appointmentList.stream().filter(a -> {
                if (a.getDate() == null) return false;
                if (sd != null && a.getDate().isBefore(sd)) return false;
                if (ed != null && a.getDate().isAfter(ed)) return false;
                return true;
            }).collect(Collectors.toList());
        } else {
            filteredAppointments = appointmentList;
        }

    Map<String, Object> out = new LinkedHashMap<>();
        List<Map<String, Object>> list = employeeList.stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", e.getId());
            m.put("name", e.getName());
            long count = filteredAppointments.stream().filter(a -> a.getEmployee() != null && a.getEmployee().getId() != null && a.getEmployee().getId().equals(e.getId())).count();
            m.put("appointmentsCount", count);
            return m;
        }).collect(Collectors.toList());
        out.put("employees", list);
        out.put("totalEmployees", list.size());
        return out;
    }

    /**
     * Build system level usage analytics.
     */
    public Map<String, Object> buildSystemAnalytics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream().filter(User::isActive).count();
        long totalVehicles = vehicleRepository.count();
        long totalAppointments = appointmentRepository.count();

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("totalUsers", totalUsers);
        out.put("activeUsers", activeUsers);
        out.put("totalVehicles", totalVehicles);
        out.put("totalAppointments", totalAppointments);
        long openTimeLogs = timeLogRepository.findAll().stream().filter(t -> t.getEndTime() == null).count();
        out.put("openTimeLogs", openTimeLogs);
        return out;
    }

    /**
     * Generate a simple PDF report from analytics map. Returns PDF bytes.
     */
    public byte[] generateAppointmentsPdf(com.autoserve.dto.report.AppointmentAnalyticsDto analytics) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), 36, 36, 36, 36);
            PdfWriter.getInstance(doc, baos);
            doc.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font h2 = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            doc.add(new Paragraph("Appointment Analytics Report", titleFont));
            doc.add(new Paragraph(" "));

            doc.add(new Paragraph("Summary", h2));
            Map<String, Long> statusCounts = analytics.getStatusCounts() != null ? analytics.getStatusCounts() : Collections.emptyMap();
            double totalRevenue = analytics.getTotalRevenue();
            doc.add(new Paragraph("Total Appointments: " + analytics.getTotalAppointments()));
            doc.add(new Paragraph("Total Revenue (estimated): " + totalRevenue));
            doc.add(new Paragraph("Status counts: " + statusCounts.toString()));
            doc.add(new Paragraph(" "));

            doc.add(new Paragraph("Daily counts (last 30 days)", h2));
            Map<String, Long> daily = analytics.getDailyCounts() != null ? analytics.getDailyCounts() : Collections.emptyMap();
            PdfPTable dailyTable = new PdfPTable(2);
            dailyTable.addCell("Date");
            dailyTable.addCell("Count");
            for (Map.Entry<String, Long> e : daily.entrySet()) {
                dailyTable.addCell(e.getKey());
                dailyTable.addCell(String.valueOf(e.getValue()));
            }
            doc.add(dailyTable);
            doc.add(new Paragraph(" "));

            doc.add(new Paragraph("Appointments (sample)", h2));
            java.util.List<com.autoserve.dto.report.AppointmentRowDto> rows = analytics.getRows() != null ? analytics.getRows() : Collections.emptyList();
            PdfPTable tbl = new PdfPTable(6);
            tbl.setWidths(new int[]{2, 2, 2, 2, 3, 3});
            tbl.addCell("ID"); tbl.addCell("Date"); tbl.addCell("Time"); tbl.addCell("Status"); tbl.addCell("Customer"); tbl.addCell("Vehicle");
            for (com.autoserve.dto.report.AppointmentRowDto r : rows) {
                tbl.addCell(String.valueOf(r.getId()));
                tbl.addCell(String.valueOf(r.getDate()));
                tbl.addCell(String.valueOf(r.getTime()));
                tbl.addCell(String.valueOf(r.getStatus()));
                tbl.addCell(String.valueOf(r.getCustomerEmail()));
                tbl.addCell(String.valueOf(r.getVehicleNumber()));
            }
            doc.add(tbl);

            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    /**
     * Generate CSV string from analytics rows.
     */
    public String generateAppointmentsCsv(com.autoserve.dto.report.AppointmentAnalyticsDto analytics) {
        StringBuilder sb = new StringBuilder();
        sb.append("id,date,time,status,customerEmail,employeeEmail,serviceId,vehicleNumber,estimatedCost,additionalNote\n");
        java.util.List<com.autoserve.dto.report.AppointmentRowDto> rows = analytics.getRows() != null ? analytics.getRows() : Collections.emptyList();
        for (com.autoserve.dto.report.AppointmentRowDto r : rows) {
            sb.append(escapeCsv(String.valueOf(r.getId()))).append(',');
            sb.append(escapeCsv(String.valueOf(r.getDate()))).append(',');
            sb.append(escapeCsv(String.valueOf(r.getTime()))).append(',');
            sb.append(escapeCsv(String.valueOf(r.getStatus()))).append(',');
            sb.append(escapeCsv(String.valueOf(r.getCustomerEmail()))).append(',');
            sb.append(escapeCsv(String.valueOf(r.getEmployeeEmail()))).append(',');
            sb.append(escapeCsv(String.valueOf(r.getServiceId()))).append(',');
            sb.append(escapeCsv(String.valueOf(r.getVehicleNumber()))).append(',');
            sb.append(escapeCsv(String.valueOf(r.getEstimatedCost()))).append(',');
            sb.append(escapeCsv(String.valueOf(r.getAdditionalNote()))).append('\n');
        }
        return sb.toString();
    }

    private String escapeCsv(String s) {
        if (s == null || "null".equals(s)) return "";
        String out = s.replace("\"", "\"\"");
        if (out.contains(",") || out.contains("\n") || out.contains("\"")) {
            return "\"" + out + "\"";
        }
        return out;
    }

}
