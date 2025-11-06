package com.autoserve.dto.report;

public class EmployeeReportDto {
    private Long employeeId;
    private String employeeEmail;
    private long appointmentsCount;

    public EmployeeReportDto() {}

    public EmployeeReportDto(Long employeeId, String employeeEmail, long appointmentsCount) {
        this.employeeId = employeeId;
        this.employeeEmail = employeeEmail;
        this.appointmentsCount = appointmentsCount;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
    }

    public long getAppointmentsCount() {
        return appointmentsCount;
    }

    public void setAppointmentsCount(long appointmentsCount) {
        this.appointmentsCount = appointmentsCount;
    }
}
