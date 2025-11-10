package com.autoserve.service;

import com.autoserve.dto.report.AppointmentAnalyticsDto;
import com.autoserve.entity.Appointment;
import com.autoserve.entity.User;
import com.autoserve.entity.Vehicle;
import com.autoserve.repository.AppointmentRepository;
import com.autoserve.repository.EmployeeRepository;
import com.autoserve.repository.TimeLogRepository;
import com.autoserve.repository.UserRepository;
import com.autoserve.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReportServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private TimeLogRepository timeLogRepository;
    
    @InjectMocks
    private ReportService reportService;

    @BeforeEach
    void setUp() {
        // MockitoExtension will inject the mocked repositories into reportService
    }

    @Test
    @DisplayName("buildAppointmentAnalytics uses repository date-range query and returns correct totals")
    void testBuildAppointmentAnalytics_dateRange() {
        Appointment a = new Appointment();
        a.setId(1L);
        a.setDate(LocalDate.of(2025, 10, 10));
        a.setTime(LocalTime.of(10, 0));
        a.setStatus("CONFIRMED");
        a.setEstimatedCost(100.0);
        User u = new User(); u.setEmail("u@example.com"); a.setCustomer(u);
        Vehicle v = new Vehicle(); v.setVehicleNumber("ABC-1"); a.setVehicle(v);

        when(appointmentRepository.findByDateBetween(LocalDate.of(2025,10,1), LocalDate.of(2025,10,31)))
                .thenReturn(List.of(a));

        AppointmentAnalyticsDto dto = reportService.buildAppointmentAnalytics(LocalDate.of(2025,10,1), LocalDate.of(2025,10,31), null);

        assertThat(dto).isNotNull();
        assertThat(dto.getTotalAppointments()).isEqualTo(1);
        assertThat(dto.getTotalRevenue()).isEqualTo(100.0);
        assertThat(dto.getStatusCounts()).containsEntry("CONFIRMED", 1L);
        assertThat(dto.getRows()).hasSize(1);
    }

    @Test
    @DisplayName("buildAppointmentAnalytics uses case-insensitive status filter via repository")
    void testBuildAppointmentAnalytics_statusIgnoreCase() {
        Appointment a1 = new Appointment();
        a1.setId(2L);
        a1.setDate(LocalDate.of(2025, 11, 1));
        a1.setStatus("finished");
        a1.setEstimatedCost(50.0);

        when(appointmentRepository.findByDateBetweenAndStatusIgnoreCase(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.eq("FINISHED")))
                .thenReturn(List.of(a1));

        AppointmentAnalyticsDto dto = reportService.buildAppointmentAnalytics(LocalDate.of(2025,11,1), LocalDate.of(2025,11,30), "FINISHED");

        assertThat(dto).isNotNull();
        assertThat(dto.getTotalAppointments()).isEqualTo(1);
        assertThat(dto.getStatusCounts()).containsKey("finished");
        assertThat(dto.getTotalRevenue()).isEqualTo(50.0);
    }
}