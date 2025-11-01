package com.autoserve.controller;

import com.autoserve.entity.Appointment;
import com.autoserve.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeAppointmentController {

    private final AppointmentService appointmentService;

    // Get all pending appointments for employee dashboard
    @GetMapping("/pending")
    public ResponseEntity<List<Appointment>> getPendingAppointments() {
        return ResponseEntity.ok(appointmentService.getPendingAppointments());
    }

    // Get all confirmed appointments for manage orders
    @GetMapping("/confirmed")
    public ResponseEntity<List<Appointment>> getConfirmedAppointments() {
        return ResponseEntity.ok(appointmentService.getConfirmedAppointments());
    }

    // Get all appointments (for employee view)
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // Update appointment status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointmentStatus(id, request.getStatus());
            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Inner class for status update request
    public static class UpdateStatusRequest {
        private String status;

        public UpdateStatusRequest() {}

        public UpdateStatusRequest(String status) {
            this.status = status;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}