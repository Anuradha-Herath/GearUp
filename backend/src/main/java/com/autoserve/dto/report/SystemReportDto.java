package com.autoserve.dto.report;

public class SystemReportDto {
    private long totalUsers;
    private long totalServices;
    private long totalVehicles;
    private long totalAppointments;

    public SystemReportDto() {}

    public SystemReportDto(long totalUsers, long totalServices, long totalVehicles, long totalAppointments) {
        this.totalUsers = totalUsers;
        this.totalServices = totalServices;
        this.totalVehicles = totalVehicles;
        this.totalAppointments = totalAppointments;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalServices() {
        return totalServices;
    }

    public void setTotalServices(long totalServices) {
        this.totalServices = totalServices;
    }

    public long getTotalVehicles() {
        return totalVehicles;
    }

    public void setTotalVehicles(long totalVehicles) {
        this.totalVehicles = totalVehicles;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }
}
