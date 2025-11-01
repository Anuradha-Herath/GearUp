package com.autoserve.service;

import com.autoserve.dto.Employee.EmployeeRequest;
import com.autoserve.entity.Employee;
import com.autoserve.repository.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Employee createEmployee(EmployeeRequest request) {
        // Check if email already exists
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken");
        }

        // Check if username already exists
        if (employeeRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // Create new employee
        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setUsername(request.getUsername());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setRole(request.getRole());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setStatus("Active");

        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public Employee updateEmployeeStatus(Long id, String status) {
        Employee employee = getEmployeeById(id);
        employee.setStatus(status);
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }
}