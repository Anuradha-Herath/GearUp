package com.autoserve.service;

import com.autoserve.dto.Auth.UpdateCustomerRequest;
import com.autoserve.entity.User;
import com.autoserve.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AdminCustomerService {

    private final UserRepository userRepository;

    public AdminCustomerService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllCustomers() {
        return userRepository.findAll().stream()
                .filter(user -> "CUSTOMER".equals(user.getRole()))
                .toList();
    }

    public Optional<User> getCustomerById(Long id) {
        return userRepository.findById(id)
                .filter(user -> "CUSTOMER".equals(user.getRole()));
    }

    @Transactional
    public User updateCustomerStatus(Long id, boolean isActive) {
        User customer = userRepository.findById(id)
                .filter(user -> "CUSTOMER".equals(user.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        
        customer.setActive(isActive);
        return userRepository.save(customer);
    }

    @Transactional
    public User updateCustomer(Long id, UpdateCustomerRequest request) {
        User customer = userRepository.findById(id)
                .filter(user -> "CUSTOMER".equals(user.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        // Check if username is being changed and if it already exists
        if (!customer.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        customer.setUsername(request.getUsername());
        customer.setPhoneNumber(request.getPhoneNumber());
        
        return userRepository.save(customer);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        User customer = userRepository.findById(id)
                .filter(user -> "CUSTOMER".equals(user.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        
        userRepository.delete(customer);
    }
}
