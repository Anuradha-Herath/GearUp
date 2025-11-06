package com.autoserve.controller;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.User;
import com.autoserve.repository.AppointmentRepository;
import com.autoserve.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    /**
     * Get dashboard overview statistics
     */
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {
        Map<String, Object> overview = new HashMap<>();
        
        // Total counts
        List<Appointment> allAppointments = appointmentRepository.findAll();
        List<User> allCustomers = userRepository.findAll().stream()
                .filter(user -> "USER".equals(user.getRole()))
                .toList();
        
        overview.put("totalAppointments", allAppointments.size());
        overview.put("totalCustomers", allCustomers.size());
        overview.put("activeCustomers", allCustomers.stream()
                .mapToInt(customer -> customer.isActive() ? 1 : 0).sum());
        
        // This month's statistics
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);
        
        long thisMonthAppointments = allAppointments.stream()
                .filter(apt -> apt.getDate() != null && 
                        !apt.getDate().isBefore(startOfMonth) && 
                        !apt.getDate().isAfter(endOfMonth))
                .count();
        
        overview.put("thisMonthAppointments", thisMonthAppointments);
        
        // Revenue calculation (estimated)
        double totalRevenue = allAppointments.stream()
                .filter(apt -> "FINISHED".equals(apt.getStatus()))
                .mapToDouble(apt -> apt.getEstimatedCost())
                .sum();
        
        overview.put("totalRevenue", totalRevenue);
        
        return ResponseEntity.ok(overview);
    }

    /**
     * Get appointment status distribution
     */
    @GetMapping("/appointments/status-distribution")
    public ResponseEntity<List<Map<String, Object>>> getAppointmentStatusDistribution() {
        List<Appointment> allAppointments = appointmentRepository.findAll();
        
        Map<String, Long> statusCounts = allAppointments.stream()
                .collect(Collectors.groupingBy(
                        Appointment::getStatus,
                        Collectors.counting()
                ));
        
        List<Map<String, Object>> distribution = statusCounts.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> statusData = new HashMap<>();
                    statusData.put("status", entry.getKey());
                    statusData.put("count", entry.getValue());
                    statusData.put("percentage", (double) entry.getValue() / allAppointments.size() * 100);
                    return statusData;
                })
                .sorted((a, b) -> ((Long) b.get("count")).compareTo((Long) a.get("count")))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(distribution);
    }

    /**
     * Get daily appointment trends (last 7 days)
     */
    @GetMapping("/appointments/daily-trends")
    public ResponseEntity<List<Map<String, Object>>> getDailyAppointmentTrends() {
        List<Appointment> allAppointments = appointmentRepository.findAll();
        
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(6); // 6 days ago + today = 7 days
        
        List<Map<String, Object>> dailyData = new ArrayList<>();
        
        for (int i = 0; i < 7; i++) {
            LocalDate currentDay = sevenDaysAgo.plusDays(i);
            
            long dailyCount = allAppointments.stream()
                    .filter(apt -> apt.getDate() != null && 
                            apt.getDate().equals(currentDay))
                    .count();
            
            double dailyRevenue = allAppointments.stream()
                    .filter(apt -> apt.getDate() != null && 
                            apt.getDate().equals(currentDay) &&
                            "FINISHED".equals(apt.getStatus()))
                    .mapToDouble(Appointment::getEstimatedCost)
                    .sum();
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("day", currentDay.format(DateTimeFormatter.ofPattern("MMM dd")));
            dayData.put("appointments", dailyCount);
            dayData.put("revenue", dailyRevenue);
            dailyData.add(dayData);
        }
        
        return ResponseEntity.ok(dailyData);
    }

    /**
     * Get monthly appointment trends (last 6 months)
     */
    @GetMapping("/appointments/monthly-trends")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyAppointmentTrends() {
        List<Appointment> allAppointments = appointmentRepository.findAll();
        
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        
        for (int i = 0; i < 6; i++) {
            LocalDate monthStart = sixMonthsAgo.plusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            
            long monthlyCount = allAppointments.stream()
                    .filter(apt -> apt.getDate() != null && 
                            !apt.getDate().isBefore(monthStart) && 
                            !apt.getDate().isAfter(monthEnd))
                    .count();
            
            double monthlyRevenue = allAppointments.stream()
                    .filter(apt -> apt.getDate() != null && 
                            !apt.getDate().isBefore(monthStart) && 
                            !apt.getDate().isAfter(monthEnd) &&
                            "FINISHED".equals(apt.getStatus()))
                    .mapToDouble(Appointment::getEstimatedCost)
                    .sum();
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthStart.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            monthData.put("appointments", monthlyCount);
            monthData.put("revenue", monthlyRevenue);
            monthlyData.add(monthData);
        }
        
        return ResponseEntity.ok(monthlyData);
    }

    /**
     * Get service popularity
     */
    @GetMapping("/services/popularity")
    public ResponseEntity<List<Map<String, Object>>> getServicePopularity() {
        List<Appointment> allAppointments = appointmentRepository.findAll();
        
        Map<String, Long> serviceCounts = allAppointments.stream()
                .filter(apt -> apt.getService() != null)
                .collect(Collectors.groupingBy(
                        apt -> apt.getService().getTitle(),
                        Collectors.counting()
                ));
        
        List<Map<String, Object>> servicePopularity = serviceCounts.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> serviceData = new HashMap<>();
                    serviceData.put("service", entry.getKey());
                    serviceData.put("count", entry.getValue());
                    return serviceData;
                })
                .sorted((a, b) -> ((Long) b.get("count")).compareTo((Long) a.get("count")))
                .limit(10) // Top 10 services
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(servicePopularity);
    }

    /**
     * Get customer activity metrics (based on appointments)
     */
    @GetMapping("/customers/activity")
    public ResponseEntity<List<Map<String, Object>>> getCustomerActivity() {
        List<Appointment> allAppointments = appointmentRepository.findAll();
        
        // Get customer activity over the last 6 months based on appointment data
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        
        List<Map<String, Object>> activityData = new ArrayList<>();
        
        for (int i = 0; i < 6; i++) {
            LocalDate monthStart = sixMonthsAgo.plusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            
            // Count unique customers who had appointments this month
            Set<Long> activeCustomersThisMonth = allAppointments.stream()
                    .filter(apt -> apt.getDate() != null && 
                            !apt.getDate().isBefore(monthStart) && 
                            !apt.getDate().isAfter(monthEnd) &&
                            apt.getCustomer() != null)
                    .map(apt -> apt.getCustomer().getId())
                    .collect(Collectors.toSet());
            
            // Count appointments this month
            long appointmentsThisMonth = allAppointments.stream()
                    .filter(apt -> apt.getDate() != null && 
                            !apt.getDate().isBefore(monthStart) && 
                            !apt.getDate().isAfter(monthEnd))
                    .count();
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthStart.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            monthData.put("activeCustomers", activeCustomersThisMonth.size());
            monthData.put("appointments", appointmentsThisMonth);
            activityData.add(monthData);
        }
        
        return ResponseEntity.ok(activityData);
    }

    /**
     * Get daily appointments for current month
     */
    @GetMapping("/appointments/daily-current-month")
    public ResponseEntity<List<Map<String, Object>>> getDailyAppointmentsCurrentMonth() {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);
        
        List<Appointment> monthAppointments = appointmentRepository.findAll().stream()
                .filter(apt -> apt.getDate() != null && 
                        !apt.getDate().isBefore(startOfMonth) && 
                        !apt.getDate().isAfter(endOfMonth))
                .toList();
        
        Map<LocalDate, Long> dailyCounts = monthAppointments.stream()
                .collect(Collectors.groupingBy(
                        Appointment::getDate,
                        Collectors.counting()
                ));
        
        List<Map<String, Object>> dailyData = new ArrayList<>();
        LocalDate current = startOfMonth;
        
        while (!current.isAfter(LocalDate.now())) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", current.format(DateTimeFormatter.ofPattern("MMM dd")));
            dayData.put("appointments", dailyCounts.getOrDefault(current, 0L));
            dailyData.add(dayData);
            current = current.plusDays(1);
        }
        
        return ResponseEntity.ok(dailyData);
    }

    /**
     * Get revenue by service type
     */
    @GetMapping("/revenue/by-service")
    public ResponseEntity<List<Map<String, Object>>> getRevenueByService() {
        List<Appointment> finishedAppointments = appointmentRepository.findAll().stream()
                .filter(apt -> "FINISHED".equals(apt.getStatus()) && apt.getService() != null)
                .toList();
        
        Map<String, Double> serviceRevenue = finishedAppointments.stream()
                .collect(Collectors.groupingBy(
                        apt -> apt.getService().getTitle(),
                        Collectors.summingDouble(Appointment::getEstimatedCost)
                ));
        
        List<Map<String, Object>> revenueData = serviceRevenue.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> serviceData = new HashMap<>();
                    serviceData.put("service", entry.getKey());
                    serviceData.put("revenue", entry.getValue());
                    return serviceData;
                })
                .sorted((a, b) -> ((Double) b.get("revenue")).compareTo((Double) a.get("revenue")))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(revenueData);
    }
}