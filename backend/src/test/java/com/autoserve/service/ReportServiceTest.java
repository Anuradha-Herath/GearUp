package com.autoserve.service;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.User;
import com.autoserve.entity.Vehicle;
import com.autoserve.entity.Service;
import com.autoserve.repository.AppointmentRepository;
import com.autoserve.repository.EmployeeRepository;
import com.autoserve.repository.TimeLogRepository;
import com.autoserve.repository.UserRepository;
import com.autoserve.repository.VehicleRepository;
import com.autoserve.dto.report.AppointmentAnalyticsDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class ReportServiceTest {

    private AppointmentRepository appointmentRepository;
    private EmployeeRepository employeeRepository;
    private UserRepository userRepository;
    private VehicleRepository vehicleRepository;
    private TimeLogRepository timeLogRepository;

    private ReportService reportService;

    @BeforeEach
    void setup() {
        appointmentRepository = Mockito.mock(AppointmentRepository.class);
        employeeRepository = Mockito.mock(EmployeeRepository.class);
        userRepository = Mockito.mock(UserRepository.class);
        vehicleRepository = Mockito.mock(VehicleRepository.class);
        timeLogRepository = Mockito.mock(TimeLogRepository.class);

        reportService = new ReportService(appointmentRepository, employeeRepository, userRepository, vehicleRepository, timeLogRepository);
    }

    @Test
    void buildAppointmentAnalytics_withDateFilter_andStatus() {
        Appointment a1 = new Appointment();
        a1.setId(1L);
        a1.setDate(LocalDate.of(2025,11,1));
        a1.setTime(LocalTime.of(9,0));
        a1.setStatus("COMPLETED");
        a1.setEstimatedCost(100.0);
        User c1 = new User();
        c1.setEmail("cust1@example.com");
        a1.setCustomer(c1);
        Vehicle v1 = new Vehicle();
        v1.setVehicleNumber("ABC-123");
        a1.setVehicle(v1);

        Appointment a2 = new Appointment();
        a2.setId(2L);
        a2.setDate(LocalDate.of(2025,11,2));
        a2.setTime(LocalTime.of(10,0));
        a2.setStatus("CANCELLED");
        a2.setEstimatedCost(50.0);
        User c2 = new User();
        c2.setEmail("cust2@example.com");
        a2.setCustomer(c2);
        Vehicle v2 = new Vehicle();
        v2.setVehicleNumber("XYZ-999");
        a2.setVehicle(v2);

        when(appointmentRepository.findAll()).thenReturn(List.of(a1, a2));

        // filter to only 2025-11-01
        AppointmentAnalyticsDto dto = reportService.buildAppointmentAnalytics(LocalDate.of(2025,11,1), LocalDate.of(2025,11,1), null);
        assertNotNull(dto);
        assertEquals(1, dto.getTotalAppointments());
        assertTrue(dto.getStatusCounts().containsKey("COMPLETED"));
        assertEquals(1L, dto.getStatusCounts().get("COMPLETED").longValue());

        // filter by status CANCELLED
        AppointmentAnalyticsDto dto2 = reportService.buildAppointmentAnalytics(null, null, "CANCELLED");
        assertNotNull(dto2);
        assertEquals(1, dto2.getTotalAppointments());
        assertTrue(dto2.getStatusCounts().containsKey("CANCELLED"));
        assertEquals(1L, dto2.getStatusCounts().get("CANCELLED").longValue());
    }
}
