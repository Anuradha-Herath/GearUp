package com.autoserve.repository;

import com.autoserve.entity.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
    // Add custom queries if needed
}