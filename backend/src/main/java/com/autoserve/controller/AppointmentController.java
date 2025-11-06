package com.autoserve.controller;

import com.autoserve.service.AppointmentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import com.autoserve.entity.Appointment;
import com.autoserve.dto.AppointmentSummary;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Public endpoint to fetch all appointments (read-only) for frontend reporting / listing
    @GetMapping("/public")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<List<Appointment>> getPublicAppointments() {
        List<Appointment> list = appointmentService.getAllAppointments();
        if (list == null || list.isEmpty()) {
            return ResponseEntity.ok().body(List.of());
        }
        return ResponseEntity.ok(list);
    }

    // New: simplified appointment summaries for frontend table (avoid deep entity serialization and mismatch)
    @GetMapping("/public/list")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<List<AppointmentSummary>> getPublicAppointmentSummaries() {
        List<Appointment> list = appointmentService.getAllAppointments();
        if (list == null || list.isEmpty()) {
            return ResponseEntity.ok().body(List.of());
        }

        List<AppointmentSummary> summaries = list.stream().map(a -> {
            String customerName = a.getCustomer() != null ? a.getCustomer().getUsername() : null;
            String serviceTitle = a.getService() != null ? a.getService().getTitle() : null;
            String mechanic = a.getEmployee() != null ? a.getEmployee().getUsername() : null;
            String notes = a.getAdditionalNote();
            return new AppointmentSummary(a.getId(), a.getDate(), a.getTime(), customerName, serviceTitle, mechanic, a.getStatus(), notes, a.getEstimatedCost());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(summaries);
    }
}