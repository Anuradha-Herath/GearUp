package com.autoserve.service.report;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.Employee;
import com.autoserve.entity.User;
import com.autoserve.repository.AppointmentRepository;
import com.autoserve.repository.EmployeeRepository;
import com.autoserve.repository.TimeLogRepository;
import com.autoserve.repository.UserRepository;
import com.autoserve.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public Map<String, Object> getAppointmentReport() {
        List<Appointment> all = appointmentRepository.findAll();
        if (all == null || all.isEmpty()) {
            return null;
        }

        Map<String, Object> out = new HashMap<>();
        out.put("totalAppointments", all.size());

        Map<String, Long> byStatus = all.stream()
                .collect(Collectors.groupingBy(a -> a.getStatus() == null ? "UNKNOWN" : a.getStatus(), Collectors.counting()));

        long upcoming7 = all.stream()
                .filter(a -> {
                    LocalDate d = a.getDate();
                    if (d == null) return false;
                    LocalDate now = LocalDate.now();
                    return !d.isBefore(now) && !d.isAfter(now.plusDays(7));
                })
                .count();

        out.put("byStatus", byStatus);
        out.put("upcomingIn7Days", upcoming7);
        return out;
    }

    public Map<String, Object> getEmployeeReport() {
        List<Employee> employees = employeeRepository.findAll();
        List<Appointment> appointments = appointmentRepository.findAll();

        if ((employees == null || employees.isEmpty()) && (appointments == null || appointments.isEmpty())) {
            return null;
        }

        Map<String, Object> out = new HashMap<>();

        List<Map<String, Object>> employeesSummary = employees.stream().map(e -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", e.getId());
            m.put("name", e.getName() == null ? "" : e.getName());
            long count = appointments.stream().filter(a -> a.getEmployee() != null && a.getEmployee().getId() != null && a.getEmployee().getId().equals(e.getId())).count();
            m.put("appointmentsCount", count);
            return m;
        }).collect(Collectors.toList());

        out.put("employees", employeesSummary);
        out.put("totalEmployees", employeesSummary.size());
        return out;
    }

    public Map<String, Object> getSystemReport() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream().filter(User::isActive).count();
        long totalVehicles = vehicleRepository.count();
        long totalAppointments = appointmentRepository.count();

        if (totalUsers == 0 && totalVehicles == 0 && totalAppointments == 0) {
            return null;
        }

        Map<String, Object> out = new HashMap<>();
        out.put("totalUsers", totalUsers);
        out.put("activeUsers", activeUsers);
        out.put("totalVehicles", totalVehicles);
        out.put("totalAppointments", totalAppointments);

        // quick time log stats
        long openTimeLogs = timeLogRepository.findAll().stream().filter(t -> t.getEndTime() == null).count();
        out.put("openTimeLogs", openTimeLogs);

        return out;
    }
}
