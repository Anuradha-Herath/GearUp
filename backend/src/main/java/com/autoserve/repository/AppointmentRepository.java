package com.autoserve.repository;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomer(User customer);
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByStatus(String status);
    long countByCustomerId(Long customerId);
    Optional<Appointment> findFirstByCustomerIdAndStatusOrderByDateDescTimeDesc(Long customerId, String status);
    List<Appointment> findByEmployeeId(Long employeeId);
}