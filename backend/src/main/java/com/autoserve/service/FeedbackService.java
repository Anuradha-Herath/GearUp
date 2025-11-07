package com.autoserve.service;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.Feedback;
import com.autoserve.entity.User;
import com.autoserve.repository.AppointmentRepository;
import com.autoserve.repository.FeedbackRepository;
import com.autoserve.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create new feedback for a completed appointment
     */
    public Feedback createFeedback(Long appointmentId, Long customerId, Integer rating, String feedbackText) {
        // Validate appointment exists and belongs to customer
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            throw new RuntimeException("Appointment not found");
        }

        Appointment appointment = appointmentOpt.get();
        if (!appointment.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Appointment does not belong to this customer");
        }

        // Check if appointment is finished
        if (!"FINISHED".equalsIgnoreCase(appointment.getStatus())) {
            throw new RuntimeException("Feedback can only be submitted for finished appointments");
        }

        // Check if feedback already exists for this appointment
        if (feedbackRepository.existsByAppointmentId(appointmentId)) {
            throw new RuntimeException("Feedback already exists for this appointment");
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        // Get customer
        Optional<User> customerOpt = userRepository.findById(customerId);
        if (customerOpt.isEmpty()) {
            throw new RuntimeException("Customer not found");
        }

        User customer = customerOpt.get();

        // Create and save feedback
        Feedback feedback = new Feedback(appointment, customer, rating, feedbackText);
        return feedbackRepository.save(feedback);
    }

    /**
     * Get feedback by appointment ID
     */
    public Optional<Feedback> getFeedbackByAppointmentId(Long appointmentId) {
        return feedbackRepository.findByAppointmentId(appointmentId);
    }

    /**
     * Get all feedback by customer ID
     */
    public List<Feedback> getFeedbackByCustomerId(Long customerId) {
        return feedbackRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    /**
     * Get all feedback for a specific service
     */
    public List<Feedback> getFeedbackByServiceId(Long serviceId) {
        return feedbackRepository.findByServiceIdOrderByCreatedAtDesc(serviceId);
    }

    /**
     * Get all feedback with a specific rating
     */
    public List<Feedback> getFeedbackByRating(Integer rating) {
        return feedbackRepository.findByRatingOrderByCreatedAtDesc(rating);
    }

    /**
     * Get all feedback (for admin/employee)
     */
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    /**
     * Get average rating for all services
     */
    public Double getAverageRating() {
        return feedbackRepository.getAverageRating();
    }

    /**
     * Get average rating for a specific service
     */
    public Double getAverageRatingForService(Long serviceId) {
        return feedbackRepository.getAverageRatingForService(serviceId);
    }

    /**
     * Check if feedback exists for an appointment
     */
    public boolean feedbackExists(Long appointmentId) {
        return feedbackRepository.existsByAppointmentId(appointmentId);
    }

    /**
     * Update existing feedback
     */
    public Feedback updateFeedback(Long feedbackId, Long customerId, Integer rating, String feedbackText) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        if (feedbackOpt.isEmpty()) {
            throw new RuntimeException("Feedback not found");
        }

        Feedback feedback = feedbackOpt.get();
        
        // Check if feedback belongs to customer
        if (!feedback.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("You can only update your own feedback");
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        feedback.setRating(rating);
        feedback.setFeedbackText(feedbackText);

        return feedbackRepository.save(feedback);
    }

    /**
     * Delete feedback (only by the customer who created it)
     */
    public void deleteFeedback(Long feedbackId, Long customerId) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        if (feedbackOpt.isEmpty()) {
            throw new RuntimeException("Feedback not found");
        }

        Feedback feedback = feedbackOpt.get();
        
        // Check if feedback belongs to customer
        if (!feedback.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("You can only delete your own feedback");
        }

        feedbackRepository.deleteById(feedbackId);
    }

    /**
     * Get feedback statistics (count by rating)
     */
    public List<Object[]> getFeedbackStatistics() {
        return feedbackRepository.countByRating();
    }

    /**
     * Get completed appointments for a customer (for feedback submission)
     */
    public List<Appointment> getCompletedAppointmentsForCustomer(Long customerId) {
        return appointmentRepository.findByCustomerIdAndStatusOrderByDateDesc(customerId, "FINISHED");
    }
}