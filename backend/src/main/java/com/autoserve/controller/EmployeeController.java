package com.autoserve.controller;

import com.autoserve.dto.Employee.EmployeeRequest;
import com.autoserve.entity.Employee;
import com.autoserve.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        try {
            Employee employee = employeeService.createEmployee(request);
            return ResponseEntity.ok(Map.of(
                "message", "Employee created successfully",
                "employee", employee
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        try {
            Employee employee = employeeService.getEmployeeById(id);
            return ResponseEntity.ok(employee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateEmployeeStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            Employee employee = employeeService.updateEmployeeStatus(id, status);
            return ResponseEntity.ok(Map.of(
                "message", "Employee status updated successfully",
                "employee", employee
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok(Map.of(
                "message", "Employee deleted successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }
}