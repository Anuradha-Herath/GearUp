package com.autoserve.repository;

import com.autoserve.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Add custom queries if needed
}