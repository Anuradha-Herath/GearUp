package com.autoserve.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "services")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String shortDescription;

    private String image;

    @Column(columnDefinition = "TEXT")
    private String includedSubservices;

    private String estimatedDuration;

    @Column(nullable = false)
    private double estimatedPrice;

    @Column(nullable = false)
    private int maxPerDay; // booking limit per day
}