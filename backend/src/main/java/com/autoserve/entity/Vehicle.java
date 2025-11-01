package com.autoserve.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;
    
    @Column(nullable = false)
    private String model;
    
    @Column(nullable = false)
    private int year;
    
    @Column(nullable = false, unique = true)
    private String vehicleNumber;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
}