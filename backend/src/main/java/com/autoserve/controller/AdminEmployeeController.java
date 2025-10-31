package com.autoserve.controller;

import com.autoserve.dto.Auth.CreateEmployeeRequest;
import com.autoserve.dto.Auth.UpdateEmployeeRequest;
import com.autoserve.entity.User;
import com.autoserve.service.AdminEmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/employees")
@PreAuthorize("hasRole('ADMIN')")
public class AdminEmployeeController {

    private final AdminEmployeeService adminEmployeeService;

    public AdminEmployeeController(AdminEmployeeService adminEmployeeService) {
        this.adminEmployeeService = adminEmployeeService;
    }

    @PostMapping
    public ResponseEntity<?> createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        try {
            User employee = adminEmployeeService.createEmployee(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Employee created successfully");
            response.put("employee", createEmployeeResponse(employee));
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create employee: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllEmployees() {
        List<User> employees = adminEmployeeService.getAllEmployees();
        List<Map<String, Object>> response = employees.stream()
                .map(this::createEmployeeResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        return adminEmployeeService.getEmployeeById(id)
                .map(employee -> ResponseEntity.ok(createEmployeeResponse(employee)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateEmployeeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        try {
            Boolean isActive = statusUpdate.get("isActive");
            if (isActive == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "isActive field is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            User employee = adminEmployeeService.updateEmployeeStatus(id, isActive);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Employee status updated successfully");
            response.put("employee", createEmployeeResponse(employee));
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmployeeRequest request) {
        try {
            User employee = adminEmployeeService.updateEmployee(id, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Employee updated successfully");
            response.put("employee", createEmployeeResponse(employee));
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            adminEmployeeService.deleteEmployee(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Employee deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Helper method to create employee response without sensitive data
    private Map<String, Object> createEmployeeResponse(User employee) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", employee.getId());
        response.put("username", employee.getUsername());
        response.put("email", employee.getEmail());
        response.put("phoneNumber", employee.getPhoneNumber());
        response.put("role", employee.getRole());
        response.put("isActive", employee.isActive());
        response.put("enabled", employee.isEnabled());
        return response;
    }
}
