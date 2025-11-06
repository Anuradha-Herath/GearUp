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
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // Return analytics as JSON
    @GetMapping("/appointments")
    public ResponseEntity<?> appointments() {
        Map<String, Object> analytics = reportService.buildAppointmentAnalytics();
        if (analytics == null || analytics.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No report data found."));
        }
        return ResponseEntity.ok(analytics);
    }

    // PDF export
    @GetMapping("/appointments/pdf")
    public ResponseEntity<byte[]> appointmentsPdf() {
        Map<String, Object> analytics = reportService.buildAppointmentAnalytics();
        byte[] pdf = reportService.generateAppointmentsPdf(analytics);
        String filename = "appointments-report-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + ".pdf";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // CSV export
    @GetMapping("/appointments/csv")
    public ResponseEntity<byte[]> appointmentsCsv() {
        Map<String, Object> analytics = reportService.buildAppointmentAnalytics();
        String csv = reportService.generateAppointmentsCsv(analytics);
        String filename = "appointments-report-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.getBytes());
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

