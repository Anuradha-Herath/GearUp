package com.autoserve.repository;

import com.autoserve.entity.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
    List<TimeLog> findByAppointmentIdAndEndTimeIsNull(Long appointmentId);
}