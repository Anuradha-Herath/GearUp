package com.autoserve.dto.Employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class EmployeeRequest {
    @NotEmpty(message = "Name is required")
    private String name;

    @NotEmpty(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotEmpty(message = "Username is required")
    @Size(min = 3, message = "Username must be at least 3 characters")
    private String username;

    @NotEmpty(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotEmpty(message = "Role is required")
    private String role;

    @NotEmpty(message = "Phone is required")
    private String phone;

    @NotEmpty(message = "Department is required")
    private String department;

    // Default constructor
    public EmployeeRequest() {}

    // Constructor with all fields
    public EmployeeRequest(String name, String email, String username, String password, 
                          String role, String phone, String department) {
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role;
        this.phone = phone;
        this.department = department;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}