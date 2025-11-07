package com.autoserve.repository;

import com.autoserve.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    // Find feedback by appointment ID
    Optional<Feedback> findByAppointmentId(Long appointmentId);
    
    // Find all feedback by customer
    List<Feedback> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    
    // Find all feedback with a specific rating
    List<Feedback> findByRatingOrderByCreatedAtDesc(Integer rating);
    
    // Find all feedback for a specific service (through appointment)
    @Query("SELECT f FROM Feedback f WHERE f.appointment.service.id = :serviceId ORDER BY f.createdAt DESC")
    List<Feedback> findByServiceIdOrderByCreatedAtDesc(@Param("serviceId") Long serviceId);
    
    // Check if feedback exists for an appointment
    boolean existsByAppointmentId(Long appointmentId);
    
    // Get average rating for all feedback
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double getAverageRating();
    
    // Get average rating for a specific service
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.appointment.service.id = :serviceId")
    Double getAverageRatingForService(@Param("serviceId") Long serviceId);
    
    // Count feedback by rating
    @Query("SELECT f.rating, COUNT(f) FROM Feedback f GROUP BY f.rating ORDER BY f.rating")
    List<Object[]> countByRating();
}