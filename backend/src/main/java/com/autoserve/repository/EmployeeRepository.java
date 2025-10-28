package com.autoserve.repository;

import com.autoserve.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Employee findByEmail(String email);
    Employee findByUsername(String username);
}