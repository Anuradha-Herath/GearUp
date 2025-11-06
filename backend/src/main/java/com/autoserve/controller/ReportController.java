package com.autoserve.controller;

import com.autoserve.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private static final Logger log = LoggerFactory.getLogger(ReportController.class);

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // Return analytics as JSON
    @GetMapping(value = "/appointments", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> appointments(@org.springframework.web.bind.annotation.RequestParam(required = false) String startDate,
                                          @org.springframework.web.bind.annotation.RequestParam(required = false) String endDate,
                                          @org.springframework.web.bind.annotation.RequestParam(required = false) String status) {
        try {
            log.info("/api/reports/appointments called with startDate={} endDate={} status={}", startDate, endDate, status);
            java.time.LocalDate sd = startDate != null && !startDate.isBlank() ? java.time.LocalDate.parse(startDate) : null;
            java.time.LocalDate ed = endDate != null && !endDate.isBlank() ? java.time.LocalDate.parse(endDate) : null;
            com.autoserve.dto.report.AppointmentAnalyticsDto analytics = reportService.buildAppointmentAnalytics(sd, ed, status);
            log.info("Built analytics: totalAppointments={} rows={}", analytics != null ? analytics.getTotalAppointments() : null, analytics != null && analytics.getRows() != null ? analytics.getRows().size() : null);
            if (analytics == null) {
                return ResponseEntity.ok().contentType(org.springframework.http.MediaType.APPLICATION_JSON).body(Map.of("message", "No report data found."));
            }
            return ResponseEntity.ok().contentType(org.springframework.http.MediaType.APPLICATION_JSON).body(analytics);
        } catch (Exception ex) {
            log.error("Failed to parse dates or build analytics", ex);
            return ResponseEntity.badRequest().contentType(org.springframework.http.MediaType.APPLICATION_JSON).body(Map.of("message", "Invalid date format. Use ISO yyyy-MM-dd."));
        }
    }

    // PDF export
    @GetMapping("/appointments/pdf")
    public ResponseEntity<byte[]> appointmentsPdf(@org.springframework.web.bind.annotation.RequestParam(required = false) String startDate,
                                                  @org.springframework.web.bind.annotation.RequestParam(required = false) String endDate,
                                                  @org.springframework.web.bind.annotation.RequestParam(required = false) String status) {
        try {
            java.time.LocalDate sd = startDate != null && !startDate.isBlank() ? java.time.LocalDate.parse(startDate) : null;
            java.time.LocalDate ed = endDate != null && !endDate.isBlank() ? java.time.LocalDate.parse(endDate) : null;
            com.autoserve.dto.report.AppointmentAnalyticsDto analytics = reportService.buildAppointmentAnalytics(sd, ed, status);
            byte[] pdf = reportService.generateAppointmentsPdf(analytics);
        String filename = "appointments-report-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + ".pdf";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(new byte[0]);
        }
    }

    // CSV export
    @GetMapping("/appointments/csv")
    public ResponseEntity<byte[]> appointmentsCsv(@org.springframework.web.bind.annotation.RequestParam(required = false) String startDate,
                                                 @org.springframework.web.bind.annotation.RequestParam(required = false) String endDate,
                                                 @org.springframework.web.bind.annotation.RequestParam(required = false) String status) {
        try {
            java.time.LocalDate sd = startDate != null && !startDate.isBlank() ? java.time.LocalDate.parse(startDate) : null;
            java.time.LocalDate ed = endDate != null && !endDate.isBlank() ? java.time.LocalDate.parse(endDate) : null;
            com.autoserve.dto.report.AppointmentAnalyticsDto analytics = reportService.buildAppointmentAnalytics(sd, ed, status);
            String csv = reportService.generateAppointmentsCsv(analytics);
        String filename = "appointments-report-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.getBytes());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(new byte[0]);
        }
    }

    @GetMapping("/employees")
    public ResponseEntity<?> employees() {
        Map<String, Object> analytics = reportService.buildEmployeeAnalytics();
        if (analytics == null || analytics.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No report data found."));
        }
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/system")
    public ResponseEntity<?> system() {
        Map<String, Object> analytics = reportService.buildSystemAnalytics();
        if (analytics == null || analytics.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No report data found."));
        }
        return ResponseEntity.ok(analytics);
    }

}

