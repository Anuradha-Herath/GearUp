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
    public Map<String, Object> buildAppointmentAnalytics() {
    List<Appointment> all = appointmentRepository.findAll();
    List<Appointment> appointments = all == null ? Collections.emptyList() : all;

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("totalAppointments", all.size());

    Map<String, Long> statusCounts = appointments.stream()
        .collect(Collectors.groupingBy(a -> a.getStatus() == null ? "UNKNOWN" : a.getStatus(), Collectors.counting()));
        out.put("statusCounts", statusCounts);

        double totalRevenue = appointments.stream()
                .mapToDouble(a -> {
                    Double cost = a.getEstimatedCost();
                    return cost == null ? 0.0 : cost;
                })
                .sum();
        out.put("totalRevenue", totalRevenue);

        Map<String, Long> daily = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter fmt = DateTimeFormatter.ISO_DATE;
        for (int i = 29; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            String key = d.format(fmt);
            long cnt = appointments.stream().filter(a -> d.equals(a.getDate())).count();
            daily.put(key, cnt);
        }
        out.put("dailyCounts", daily);

    List<Map<String, Object>> rows = appointments.stream().map(a -> {
            Map<String, Object> r = new LinkedHashMap<>();
            r.put("id", a.getId());
            r.put("date", a.getDate());
            r.put("time", a.getTime());
            r.put("status", a.getStatus());
            r.put("estimatedCost", a.getEstimatedCost());
            User cu = a.getCustomer();
            r.put("customerEmail", cu != null ? cu.getEmail() : null);
            User eu = a.getEmployee();
            r.put("employeeEmail", eu != null ? eu.getEmail() : null);
            r.put("serviceId", a.getService() != null ? a.getService().getId() : null);
            Vehicle v = a.getVehicle();
            r.put("vehicleNumber", v != null ? v.getVehicleNumber() : null);
            r.put("additionalNote", a.getAdditionalNote());
            return r;
        }).collect(Collectors.toList());
        out.put("rows", rows);

        return out;
    }

    /**
     * Build simple employee performance analytics.
     */
    public Map<String, Object> buildEmployeeAnalytics() {
        List<Employee> employees = employeeRepository.findAll();
        List<Appointment> all = appointmentRepository.findAll();
        List<Employee> employeeList = employees == null ? Collections.emptyList() : employees;
        List<Appointment> appointmentList = all == null ? Collections.emptyList() : all;

        Map<String, Object> out = new LinkedHashMap<>();
        List<Map<String, Object>> list = employeeList.stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", e.getId());
            m.put("name", e.getName());
            long count = appointmentList.stream().filter(a -> a.getEmployee() != null && a.getEmployee().getId() != null && a.getEmployee().getId().equals(e.getId())).count();
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
    public byte[] generateAppointmentsPdf(Map<String, Object> analytics) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), 36, 36, 36, 36);
            PdfWriter.getInstance(doc, baos);
            doc.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font h2 = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            doc.add(new Paragraph("Appointment Analytics Report", titleFont));
            doc.add(new Paragraph(" "));

            doc.add(new Paragraph("Summary", h2));
            @SuppressWarnings("unchecked")
            Map<String, Long> statusCounts = (Map<String, Long>) analytics.getOrDefault("statusCounts", Collections.emptyMap());
            double totalRevenue = ((Number) analytics.getOrDefault("totalRevenue", 0.0)).doubleValue();
            doc.add(new Paragraph("Total Appointments: " + analytics.getOrDefault("totalAppointments", 0)));
            doc.add(new Paragraph("Total Revenue (estimated): " + totalRevenue));
            doc.add(new Paragraph("Status counts: " + statusCounts.toString()));
            doc.add(new Paragraph(" "));

            doc.add(new Paragraph("Daily counts (last 30 days)", h2));
            @SuppressWarnings("unchecked")
            Map<String, Long> daily = (Map<String, Long>) analytics.getOrDefault("dailyCounts", Collections.emptyMap());
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
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> rows = (List<Map<String, Object>>) analytics.getOrDefault("rows", Collections.emptyList());
            PdfPTable tbl = new PdfPTable(6);
            tbl.setWidths(new int[]{2, 2, 2, 2, 3, 3});
            tbl.addCell("ID"); tbl.addCell("Date"); tbl.addCell("Time"); tbl.addCell("Status"); tbl.addCell("Customer"); tbl.addCell("Vehicle");
            for (Map<String, Object> r : rows) {
                tbl.addCell(String.valueOf(r.get("id")));
                tbl.addCell(String.valueOf(r.get("date")));
                tbl.addCell(String.valueOf(r.get("time")));
                tbl.addCell(String.valueOf(r.get("status")));
                tbl.addCell(String.valueOf(r.get("customerEmail")));
                tbl.addCell(String.valueOf(r.get("vehicleNumber")));
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
    public String generateAppointmentsCsv(Map<String, Object> analytics) {
        StringBuilder sb = new StringBuilder();
        sb.append("id,date,time,status,customerEmail,employeeEmail,serviceId,vehicleNumber,estimatedCost,additionalNote\n");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> rows = (List<Map<String, Object>>) analytics.getOrDefault("rows", Collections.emptyList());
        for (Map<String, Object> r : rows) {
            sb.append(escapeCsv(String.valueOf(r.get("id")))).append(',');
            sb.append(escapeCsv(String.valueOf(r.get("date")))).append(',');
            sb.append(escapeCsv(String.valueOf(r.get("time")))).append(',');
            sb.append(escapeCsv(String.valueOf(r.get("status")))).append(',');
            sb.append(escapeCsv(String.valueOf(r.get("customerEmail")))).append(',');
            sb.append(escapeCsv(String.valueOf(r.get("employeeEmail")))).append(',');
            sb.append(escapeCsv(String.valueOf(r.get("serviceId")))).append(',');
            sb.append(escapeCsv(String.valueOf(r.get("vehicleNumber")))).append(',');
            sb.append(escapeCsv(String.valueOf(r.get("estimatedCost")))).append(',');
            sb.append(escapeCsv(String.valueOf(r.get("additionalNote")))).append('\n');
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
