package com.autoserve.controller;

import com.autoserve.entity.Appointment;
import com.autoserve.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminAppointmentController {

    private final AppointmentService appointmentService;

    /**
     * Get all appointments for admin view
     * @return List of all appointments
     */
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        try {
            List<Appointment> appointments = appointmentService.getAllAppointments();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get appointment by ID for detailed view
     * @param id appointment ID
     * @return appointment details
     */
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        try {
            Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
            if (appointment.isPresent()) {
                return ResponseEntity.ok(appointment.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get appointments by status for filtering
     * @param status appointment status
     * @return List of appointments with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(@PathVariable String status) {
        try {
            List<Appointment> appointments;
            switch (status.toUpperCase()) {
                case "REQUESTED":
                    appointments = appointmentService.getPendingAppointments();
                    break;
                case "CONFIRMED":
                    appointments = appointmentService.getConfirmedAppointments();
                    break;
                default:
                    // For other statuses, we'll filter from all appointments
                    appointments = appointmentService.getAllAppointments()
                            .stream()
                            .filter(app -> app.getStatus().equalsIgnoreCase(status))
                            .toList();
            }
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Update appointment status (admin can change any appointment status)
     * @param id appointment ID
     * @param request status update request
     * @return updated appointment
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long id, 
            @RequestBody UpdateStatusRequest request) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointmentStatus(id, request.getStatus());
            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get appointment statistics for admin dashboard
     * @return appointment statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<AppointmentStatistics> getAppointmentStatistics() {
        try {
            List<Appointment> allAppointments = appointmentService.getAllAppointments();
            
            AppointmentStatistics stats = new AppointmentStatistics();
            stats.setTotal(allAppointments.size());
            stats.setRequested(allAppointments.stream().mapToInt(a -> "REQUESTED".equals(a.getStatus()) ? 1 : 0).sum());
            stats.setConfirmed(allAppointments.stream().mapToInt(a -> "CONFIRMED".equals(a.getStatus()) ? 1 : 0).sum());
            stats.setPending(allAppointments.stream().mapToInt(a -> "PENDING".equals(a.getStatus()) ? 1 : 0).sum());
            stats.setOngoing(allAppointments.stream().mapToInt(a -> "ONGOING".equals(a.getStatus()) ? 1 : 0).sum());
            stats.setFinished(allAppointments.stream().mapToInt(a -> "FINISHED".equals(a.getStatus()) ? 1 : 0).sum());
            stats.setCancelled(allAppointments.stream().mapToInt(a -> "CANCELLED".equals(a.getStatus()) ? 1 : 0).sum());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Inner classes for request/response DTOs
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

    public static class AppointmentStatistics {
        private int total;
        private int requested;
        private int confirmed;
        private int pending;
        private int ongoing;
        private int finished;
        private int cancelled;

        // Constructors
        public AppointmentStatistics() {}

        // Getters and Setters
        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }

        public int getRequested() {
            return requested;
        }

        public void setRequested(int requested) {
            this.requested = requested;
        }

        public int getConfirmed() {
            return confirmed;
        }

        public void setConfirmed(int confirmed) {
            this.confirmed = confirmed;
        }

        public int getPending() {
            return pending;
        }

        public void setPending(int pending) {
            this.pending = pending;
        }

        public int getOngoing() {
            return ongoing;
        }

        public void setOngoing(int ongoing) {
            this.ongoing = ongoing;
        }

        public int getFinished() {
            return finished;
        }

        public void setFinished(int finished) {
            this.finished = finished;
        }

        public int getCancelled() {
            return cancelled;
        }

        public void setCancelled(int cancelled) {
            this.cancelled = cancelled;
        }
    }
}