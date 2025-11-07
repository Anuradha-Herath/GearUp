package com.autoserve.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    @JsonBackReference
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonBackReference
    private User customer;

    @Column(nullable = false)
    private Integer rating; // 1-5 stars

    @Lob
    @Column(name = "feedback_text", columnDefinition = "TEXT")
    private String feedbackText;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Feedback() {}

    public Feedback(Appointment appointment, User customer, Integer rating, String feedbackText) {
        this.appointment = appointment;
        this.customer = customer;
        this.rating = rating;
        this.feedbackText = feedbackText;
    }
}