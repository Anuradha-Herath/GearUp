package com.autoserve.controller;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.User;
import com.autoserve.entity.Feedback;
import com.autoserve.repository.AppointmentRepository;
import com.autoserve.repository.UserRepository;
import com.autoserve.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import com.autoserve.repository.FinancialTransactionRepository;
import com.autoserve.entity.FinancialTransaction;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final FinancialTransactionRepository financialTransactionRepository;
    private final FeedbackRepository feedbackRepository;

    /**
     * Get dashboard overview statistics
     */
    @GetMapping("/overview")
        public ResponseEntity<Map<String, Object>> getDashboardOverview(@org.springframework.web.bind.annotation.RequestParam(required = false) String startDate,
                                                                                                                                        @org.springframework.web.bind.annotation.RequestParam(required = false) String endDate) {
                java.time.LocalDate sd = startDate != null && !startDate.isBlank() ? java.time.LocalDate.parse(startDate) : null;
                java.time.LocalDate ed = endDate != null && !endDate.isBlank() ? java.time.LocalDate.parse(endDate) : null;

                Map<String, Object> overview = new HashMap<>();
        
                // Total counts
                List<Appointment> allAppointments = appointmentRepository.findAll();
                if (sd != null || ed != null) {
                        allAppointments = allAppointments.stream().filter(a -> {
                                if (a.getDate() == null) return false;
                                if (sd != null && a.getDate().isBefore(sd)) return false;
                                if (ed != null && a.getDate().isAfter(ed)) return false;
                                return true;
                        }).toList();
                }
        List<User> allCustomers = userRepository.findAll().stream()
                .filter(user -> "CUSTOMER".equals(user.getRole()))
                .toList();
        
        List<User> allEmployees = userRepository.findAll().stream()
                .filter(user -> "EMPLOYEE".equals(user.getRole()))
                .toList();
        
        // Get feedback counts
        long totalFeedbacks = feedbackRepository.count();
        
        overview.put("totalAppointments", allAppointments.size());
        overview.put("totalCustomers", allCustomers.size());
        overview.put("totalEmployees", allEmployees.size());
        overview.put("totalFeedbacks", totalFeedbacks);
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
        
        // Revenue calculation: prefer actual financial transactions if present, otherwise estimate from finished appointments
        Double financialSum = null;
        try {
            financialSum = financialTransactionRepository.sumAmountBetween(sd, ed);
        } catch (Exception ex) {
            // repo may not exist or query fail in some environments; fall back to appointment estimate
            financialSum = null;
        }

        double appointmentEstimate = allAppointments.stream()
                .filter(apt -> "FINISHED".equals(apt.getStatus()))
                .mapToDouble(apt -> apt.getEstimatedCost())
                .sum();

        double totalRevenue = (financialSum != null && financialSum > 0) ? financialSum : appointmentEstimate;
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
        public ResponseEntity<List<Map<String, Object>>> getRevenueByService(@org.springframework.web.bind.annotation.RequestParam(required = false) String startDate,
                                                                                                                                                  @org.springframework.web.bind.annotation.RequestParam(required = false) String endDate) {
                java.time.LocalDate sd = startDate != null && !startDate.isBlank() ? java.time.LocalDate.parse(startDate) : null;
                java.time.LocalDate ed = endDate != null && !endDate.isBlank() ? java.time.LocalDate.parse(endDate) : null;

                List<Appointment> finishedAppointments = appointmentRepository.findAll().stream()
                                .filter(apt -> "FINISHED".equals(apt.getStatus()) && apt.getService() != null)
                                .filter(apt -> {
                                        if (sd != null && (apt.getDate() == null || apt.getDate().isBefore(sd))) return false;
                                        if (ed != null && (apt.getDate() == null || apt.getDate().isAfter(ed))) return false;
                                        return true;
                                })
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

        /**
         * Financial transactions summary (total revenue, total transactions, monthly breakdown)
         */
        @GetMapping("/financial-summary")
        public ResponseEntity<Map<String, Object>> getFinancialSummary(@org.springframework.web.bind.annotation.RequestParam(required = false) String startDate,
                                                                                                                                   @org.springframework.web.bind.annotation.RequestParam(required = false) String endDate) {
                java.time.LocalDate sd = startDate != null && !startDate.isBlank() ? java.time.LocalDate.parse(startDate) : null;
                java.time.LocalDate ed = endDate != null && !endDate.isBlank() ? java.time.LocalDate.parse(endDate) : null;

                // use repository aggregates to compute totals (avoids null / empty-list sum issues)
                Double totalRevenue = financialTransactionRepository.sumAmountBetween(sd, ed);
                if (totalRevenue == null) totalRevenue = 0.0;
                Long totalTransactions = financialTransactionRepository.countBetween(sd, ed);

                // monthly breakdown still needs the transactions themselves for grouping
                List<FinancialTransaction> txs = (sd != null && ed != null) ? financialTransactionRepository.findByDateBetween(sd, ed) : financialTransactionRepository.findAll();
                java.time.format.DateTimeFormatter fmt = java.time.format.DateTimeFormatter.ofPattern("MMM yyyy");
                Map<String, Double> monthly = txs.stream()
                        .filter(t -> t.getDate() != null)
                        .collect(Collectors.groupingBy(t -> t.getDate().withDayOfMonth(1).format(fmt), Collectors.summingDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0)));

                Map<String, Object> out = new LinkedHashMap<>();
                out.put("totalRevenue", totalRevenue);
                out.put("totalTransactions", totalTransactions != null ? totalTransactions.intValue() : 0);
                out.put("monthly", monthly);
                return ResponseEntity.ok(out);
        }

        /**
         * Get feedback analytics with rating distribution
         */
        @GetMapping("/feedback/analytics")
        public ResponseEntity<Map<String, Object>> getFeedbackAnalytics() {
                List<Feedback> allFeedbacks = feedbackRepository.findAll();
                
                Map<String, Object> feedbackData = new HashMap<>();
                feedbackData.put("totalFeedbacks", allFeedbacks.size());
                
                // Calculate average rating
                double averageRating = allFeedbacks.stream()
                        .filter(f -> f.getRating() != null)
                        .mapToInt(Feedback::getRating)
                        .average()
                        .orElse(0.0);
                
                feedbackData.put("averageRating", Math.round(averageRating * 100.0) / 100.0);
                
                // Rating distribution (1-5 stars)
                Map<Integer, Long> ratingDistribution = allFeedbacks.stream()
                        .filter(f -> f.getRating() != null)
                        .collect(Collectors.groupingBy(Feedback::getRating, Collectors.counting()));
                
                feedbackData.put("ratingDistribution", ratingDistribution);
                
                // Recent feedbacks (last 10)
                List<Map<String, Object>> recentFeedbacks = allFeedbacks.stream()
                        .sorted((f1, f2) -> {
                                if (f1.getCreatedAt() == null && f2.getCreatedAt() == null) return 0;
                                if (f1.getCreatedAt() == null) return 1;
                                if (f2.getCreatedAt() == null) return -1;
                                return f2.getCreatedAt().compareTo(f1.getCreatedAt());
                        })
                        .limit(10)
                        .map(f -> {
                                Map<String, Object> feedbackMap = new HashMap<>();
                                feedbackMap.put("id", f.getId());
                                feedbackMap.put("rating", f.getRating());
                                feedbackMap.put("feedbackText", f.getFeedbackText());
                                feedbackMap.put("customerEmail", f.getCustomer() != null ? f.getCustomer().getEmail() : null);
                                feedbackMap.put("appointmentId", f.getAppointment() != null ? f.getAppointment().getId() : null);
                                feedbackMap.put("createdAt", f.getCreatedAt());
                                return feedbackMap;
                        })
                        .collect(Collectors.toList());
                
                feedbackData.put("recentFeedbacks", recentFeedbacks);
                
                return ResponseEntity.ok(feedbackData);
        }
}