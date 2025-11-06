package com.autoserve.dto.report;

import java.util.List;
import java.util.Map;

public class AppointmentAnalyticsDto {
    private long totalAppointments;
    private Map<String, Long> statusCounts;
    private double totalRevenue;
    private Map<String, Long> dailyCounts;
    private List<AppointmentRowDto> rows;

    public AppointmentAnalyticsDto() {}

    public AppointmentAnalyticsDto(long totalAppointments, Map<String, Long> statusCounts, double totalRevenue, Map<String, Long> dailyCounts, List<AppointmentRowDto> rows) {
        this.totalAppointments = totalAppointments;
        this.statusCounts = statusCounts;
        this.totalRevenue = totalRevenue;
        this.dailyCounts = dailyCounts;
        this.rows = rows;
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

    public Map<String, Long> getDailyCounts() {
        return dailyCounts;
    }

    public void setDailyCounts(Map<String, Long> dailyCounts) {
        this.dailyCounts = dailyCounts;
    }

    public List<AppointmentRowDto> getRows() {
        return rows;
    }

    public void setRows(List<AppointmentRowDto> rows) {
        this.rows = rows;
    }
}
