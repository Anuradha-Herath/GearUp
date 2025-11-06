package com.autoserve.dto.report;

public class AppointmentRowDto {
    private Long id;
    private String date;
    private String time;
    private String status;
    private Double estimatedCost;
    private String customerEmail;
    private String employeeEmail;
    private Long serviceId;
    private String vehicleNumber;
    private String additionalNote;

    public AppointmentRowDto() {}

    public AppointmentRowDto(Long id, String date, String time, String status, Double estimatedCost, String customerEmail, String employeeEmail, Long serviceId, String vehicleNumber, String additionalNote) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.status = status;
        this.estimatedCost = estimatedCost;
        this.customerEmail = customerEmail;
        this.employeeEmail = employeeEmail;
        this.serviceId = serviceId;
        this.vehicleNumber = vehicleNumber;
        this.additionalNote = additionalNote;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(Double estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getAdditionalNote() {
        return additionalNote;
    }

    public void setAdditionalNote(String additionalNote) {
        this.additionalNote = additionalNote;
    }
}
