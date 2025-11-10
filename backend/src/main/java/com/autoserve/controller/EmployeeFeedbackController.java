package com.autoserve.controller;

import com.autoserve.entity.Feedback;
import com.autoserve.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee/feedback")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeFeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    /**
     * Get all feedback (for employees to view customer feedback)
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllFeedback() {
        try {
            List<Feedback> allFeedback = feedbackService.getAllFeedback();
            return ResponseEntity.ok(allFeedback);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get feedback statistics for dashboard
     */
    @GetMapping("/statistics")
    public ResponseEntity<?> getFeedbackStatistics() {
        try {
            List<Object[]> stats = feedbackService.getFeedbackStatistics();
            Double averageRating = feedbackService.getAverageRating();
            
            Map<String, Object> response = new HashMap<>();
            response.put("ratingDistribution", stats);
            response.put("averageRating", averageRating);
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get feedback for a specific service
     */
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<?> getFeedbackByService(@PathVariable Long serviceId) {
        try {
            List<Feedback> serviceFeedback = feedbackService.getFeedbackByServiceId(serviceId);
            return ResponseEntity.ok(serviceFeedback);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get feedback by rating
     */
    @GetMapping("/rating/{rating}")
    public ResponseEntity<?> getFeedbackByRating(@PathVariable Integer rating) {
        try {
            List<Feedback> ratingFeedback = feedbackService.getFeedbackByRating(rating);
            return ResponseEntity.ok(ratingFeedback);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}