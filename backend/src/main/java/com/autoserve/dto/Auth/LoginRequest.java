package com.autoserve.dto.Auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    private String username; // Optional: username for login
    
    private String email; // Optional: email for login

    @NotBlank(message = "Password is required")
    private String password;

    // Helper method to get the login identifier (email or username)
    public String getLoginIdentifier() {
        if (email != null && !email.isBlank()) {
            return email;
        }
        return username;
    }

    // Manual getters and setters for compilation if Lombok fails
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}