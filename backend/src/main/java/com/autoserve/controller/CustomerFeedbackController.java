package com.autoserve.controller;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.Feedback;
import com.autoserve.entity.User;
import com.autoserve.repository.UserRepository;
import com.autoserve.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer/feedback")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerFeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Submit feedback for a completed appointment
     */
    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            User customer = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            Long customerId = customer.getId();

            Feedback feedback = feedbackService.createFeedback(
                request.getAppointmentId(),
                customerId,
                request.getRating(),
                request.getFeedbackText()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Feedback submitted successfully");
            response.put("feedbackId", feedback.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get feedback by appointment ID
     */
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getFeedbackByAppointment(@PathVariable Long appointmentId) {
        try {
            Optional<Feedback> feedback = feedbackService.getFeedbackByAppointmentId(appointmentId);
            
            if (feedback.isPresent()) {
                return ResponseEntity.ok(feedback.get());
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("exists", false);
                response.put("message", "No feedback found for this appointment");
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get all feedback by current customer
     */
    @GetMapping("/my-feedback")
    public ResponseEntity<?> getMyFeedback() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            User customer = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            Long customerId = customer.getId();

            List<Feedback> feedbackList = feedbackService.getFeedbackByCustomerId(customerId);
            return ResponseEntity.ok(feedbackList);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Update existing feedback
     */
    @PutMapping("/{feedbackId}")
    public ResponseEntity<?> updateFeedback(@PathVariable Long feedbackId, @RequestBody FeedbackRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            User customer = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            Long customerId = customer.getId();

            Feedback feedback = feedbackService.updateFeedback(
                feedbackId,
                customerId,
                request.getRating(),
                request.getFeedbackText()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Feedback updated successfully");
            response.put("feedback", feedback);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Delete feedback
     */
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long feedbackId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            User customer = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            Long customerId = customer.getId();

            feedbackService.deleteFeedback(feedbackId, customerId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Feedback deleted successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Check if feedback exists for an appointment
     */
    @GetMapping("/exists/{appointmentId}")
    public ResponseEntity<?> checkFeedbackExists(@PathVariable Long appointmentId) {
        try {
            boolean exists = feedbackService.feedbackExists(appointmentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get completed appointments for feedback submission
     */
    @GetMapping("/completed-appointments")
    public ResponseEntity<?> getCompletedAppointments() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            User customer = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            Long customerId = customer.getId();

            List<Appointment> completedAppointments = feedbackService.getCompletedAppointmentsForCustomer(customerId);
            return ResponseEntity.ok(completedAppointments);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }



    // Inner class for request body
    public static class FeedbackRequest {
        private Long appointmentId;
        private Integer rating;
        private String feedbackText;

        // Getters and setters
        public Long getAppointmentId() {
            return appointmentId;
        }

        public void setAppointmentId(Long appointmentId) {
            this.appointmentId = appointmentId;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getFeedbackText() {
            return feedbackText;
        }

        public void setFeedbackText(String feedbackText) {
            this.feedbackText = feedbackText;
        }
    }
}