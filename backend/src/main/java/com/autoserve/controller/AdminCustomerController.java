package com.autoserve.controller;

import com.autoserve.dto.Auth.UpdateCustomerRequest;
import com.autoserve.entity.User;
import com.autoserve.service.AdminCustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/customers")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;

    public AdminCustomerController(AdminCustomerService adminCustomerService) {
        this.adminCustomerService = adminCustomerService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCustomers() {
        List<User> customers = adminCustomerService.getAllCustomers();
        List<Map<String, Object>> response = customers.stream()
                .map(this::createCustomerResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        return adminCustomerService.getCustomerById(id)
                .map(customer -> ResponseEntity.ok(createCustomerResponse(customer)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateCustomerStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        try {
            Boolean isActive = statusUpdate.get("isActive");
            if (isActive == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "isActive field is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            User customer = adminCustomerService.updateCustomerStatus(id, isActive);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Customer status updated successfully");
            response.put("customer", createCustomerResponse(customer));
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCustomerRequest request) {
        try {
            User customer = adminCustomerService.updateCustomer(id, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Customer updated successfully");
            response.put("customer", createCustomerResponse(customer));
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try {
            adminCustomerService.deleteCustomer(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Customer deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Helper method to create customer response without sensitive data
    private Map<String, Object> createCustomerResponse(User customer) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", customer.getId());
        response.put("username", customer.getUsername());
        response.put("email", customer.getEmail());
        response.put("phoneNumber", customer.getPhoneNumber());
        response.put("role", customer.getRole());
        response.put("isActive", customer.isActive());
        response.put("enabled", customer.isEnabled());
        return response;
    }
}
