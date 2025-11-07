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
    // Date range queries
    List<Appointment> findByDateBetween(java.time.LocalDate startDate, java.time.LocalDate endDate);
    List<Appointment> findByDateBetweenAndStatus(java.time.LocalDate startDate, java.time.LocalDate endDate, String status);
    // Case-insensitive variants
    List<Appointment> findByStatusIgnoreCase(String status);
    List<Appointment> findByDateBetweenAndStatusIgnoreCase(java.time.LocalDate startDate, java.time.LocalDate endDate, String status);
    List<Appointment> findByDateGreaterThanEqual(java.time.LocalDate startDate);
    List<Appointment> findByDateLessThanEqual(java.time.LocalDate endDate);
    List<Appointment> findByDateGreaterThanEqualAndStatus(java.time.LocalDate startDate, String status);
    List<Appointment> findByDateLessThanEqualAndStatus(java.time.LocalDate endDate, String status);
    List<Appointment> findByDateGreaterThanEqualAndStatusIgnoreCase(java.time.LocalDate startDate, String status);
    List<Appointment> findByDateLessThanEqualAndStatusIgnoreCase(java.time.LocalDate endDate, String status);
    long countByCustomerId(Long customerId);
    Optional<Appointment> findFirstByCustomerIdAndStatusOrderByDateDescTimeDesc(Long customerId, String status);
    List<Appointment> findByEmployeeId(Long employeeId);
}