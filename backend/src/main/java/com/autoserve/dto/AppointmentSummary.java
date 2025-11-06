package com.autoserve.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentSummary {
    private Long id;
    private LocalDate date;
    private LocalTime time;
    private String customerName;
    private String serviceTitle;
    private String mechanicName;
    private String status;
    private String notes;
    private Double estimatedCost;

    public AppointmentSummary() {}

    public AppointmentSummary(Long id, LocalDate date, LocalTime time, String customerName, String serviceTitle, String mechanicName, String status, String notes, Double estimatedCost) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.customerName = customerName;
        this.serviceTitle = serviceTitle;
        this.mechanicName = mechanicName;
        this.status = status;
        this.notes = notes;
        this.estimatedCost = estimatedCost;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getServiceTitle() { return serviceTitle; }
    public void setServiceTitle(String serviceTitle) { this.serviceTitle = serviceTitle; }
    public String getMechanicName() { return mechanicName; }
    public void setMechanicName(String mechanicName) { this.mechanicName = mechanicName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }
}
