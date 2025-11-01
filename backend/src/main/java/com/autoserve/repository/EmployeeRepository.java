package com.autoserve.repository;

import com.autoserve.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Employee findByEmail(String email);
    Employee findByUsername(String username);
    Optional<Employee> findByResetPasswordToken(String resetPasswordToken);
}