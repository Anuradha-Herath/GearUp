package com.autoserve.repository;

import com.autoserve.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Add custom queries if needed
}