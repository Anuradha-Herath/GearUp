package com.autoserve.dto.report;

import java.util.Map;

public class AppointmentReportDto {
    private long totalAppointments;
    private Map<String, Long> statusCounts;
    private double totalRevenue;

    public AppointmentReportDto() {}

    public AppointmentReportDto(long totalAppointments, Map<String, Long> statusCounts, double totalRevenue) {
        this.totalAppointments = totalAppointments;
        this.statusCounts = statusCounts;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public Map<String, Long> getStatusCounts() {
        return statusCounts;
    }

    public void setStatusCounts(Map<String, Long> statusCounts) {
        this.statusCounts = statusCounts;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
