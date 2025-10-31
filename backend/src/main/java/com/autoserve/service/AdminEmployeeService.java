package com.autoserve.service;

import com.autoserve.dto.Auth.CreateEmployeeRequest;
import com.autoserve.dto.Auth.UpdateEmployeeRequest;
import com.autoserve.entity.User;
import com.autoserve.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AdminEmployeeService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminEmployeeService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User createEmployee(CreateEmployeeRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create new employee user
        User employee = new User();
        employee.setUsername(request.getUsername());
        employee.setEmail(request.getEmail());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setRole("EMPLOYEE");
        employee.setEnabled(true); // Employee accounts are active by default
        employee.setActive(true);  // Employee accounts are active by default

        return userRepository.save(employee);
    }

    public List<User> getAllEmployees() {
        return userRepository.findAll().stream()
                .filter(user -> "EMPLOYEE".equals(user.getRole()))
                .toList();
    }

    public Optional<User> getEmployeeById(Long id) {
        return userRepository.findById(id)
                .filter(user -> "EMPLOYEE".equals(user.getRole()));
    }

    @Transactional
    public User updateEmployeeStatus(Long id, boolean isActive) {
        User employee = userRepository.findById(id)
                .filter(user -> "EMPLOYEE".equals(user.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        
        employee.setActive(isActive);
        return userRepository.save(employee);
    }

    @Transactional
    public User updateEmployee(Long id, UpdateEmployeeRequest request) {
        User employee = userRepository.findById(id)
                .filter(user -> "EMPLOYEE".equals(user.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        // Check if username is being changed and if it already exists
        if (!employee.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        employee.setUsername(request.getUsername());
        employee.setPhoneNumber(request.getPhoneNumber());
        
        return userRepository.save(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        User employee = userRepository.findById(id)
                .filter(user -> "EMPLOYEE".equals(user.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        
        userRepository.delete(employee);
    }
}
