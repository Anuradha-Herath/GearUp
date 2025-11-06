package com.autoserve.repository;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.Service;
import com.autoserve.entity.User;
import com.autoserve.entity.Vehicle;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class AppointmentRepositoryTest {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private com.autoserve.repository.ServiceRepository serviceRepository;

    @Test
    @DisplayName("findByDateBetween returns only appointments within range")
    public void testFindByDateBetween() {
        User customer = new User();
        customer.setUsername("cust1");
        customer.setEmail("cust1@example.com");
        userRepository.save(customer);

        Vehicle v = new Vehicle();
        v.setVehicleNumber("ABC-123");
        v.setCustomer(customer);
        vehicleRepository.save(v);

        Service s = new Service();
        s.setTitle("Oil Change");
        serviceRepository.save(s);

        Appointment inRange = new Appointment();
        inRange.setCustomer(customer);
        inRange.setVehicle(v);
        inRange.setService(s);
        inRange.setDate(LocalDate.of(2025, 10, 10));
        inRange.setTime(LocalTime.of(10, 0));
        inRange.setStatus("CONFIRMED");
        appointmentRepository.save(inRange);

        Appointment outRange = new Appointment();
        outRange.setCustomer(customer);
        outRange.setVehicle(v);
        outRange.setService(s);
        outRange.setDate(LocalDate.of(2025, 9, 1));
        outRange.setTime(LocalTime.of(9, 0));
        outRange.setStatus("REQUESTED");
        appointmentRepository.save(outRange);

        List<Appointment> results = appointmentRepository.findByDateBetween(LocalDate.of(2025, 10, 1), LocalDate.of(2025, 10, 31));
        assertThat(results).isNotNull();
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getStatus()).isEqualTo("CONFIRMED");
    }

    @Test
    @DisplayName("status filtering is case-insensitive using findByStatusIgnoreCase")
    public void testFindByStatusIgnoreCase() {
        User customer = new User();
        customer.setUsername("cust2");
        customer.setEmail("cust2@example.com");
        userRepository.save(customer);

        Vehicle v = new Vehicle();
        v.setVehicleNumber("XYZ-789");
        v.setCustomer(customer);
        vehicleRepository.save(v);

        Service s = new Service();
        s.setTitle("Tire Rotation");
        serviceRepository.save(s);

        Appointment a1 = new Appointment();
        a1.setCustomer(customer);
        a1.setVehicle(v);
        a1.setService(s);
        a1.setDate(LocalDate.of(2025, 11, 1));
        a1.setTime(LocalTime.of(11, 0));
        a1.setStatus("finished"); // lower-case
        appointmentRepository.save(a1);

        List<Appointment> results = appointmentRepository.findByStatusIgnoreCase("FINISHED");
        assertThat(results).isNotNull();
        assertThat(results).hasSizeGreaterThanOrEqualTo(1);
        boolean found = results.stream().anyMatch(x -> "finished".equals(x.getStatus()));
        assertThat(found).isTrue();
    }
}
