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
            System.out.println("[EmployeeAppointmentController] updateAppointmentStatus called - id: " + id + ", status: " + request.getStatus());
            Appointment updatedAppointment = appointmentService.updateAppointmentStatus(id, request.getStatus());
            System.out.println("[EmployeeAppointmentController] updateAppointmentStatus succeeded for id: " + id + " -> " + updatedAppointment.getStatus());
            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            System.err.println("[EmployeeAppointmentController] RuntimeException while updating status for id: " + id + " -> " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            System.err.println("[EmployeeAppointmentController] Exception while updating status for id: " + id + " -> " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
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