package com.autoserve.dto.Auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email or username is required")
    private String username; // This field accepts both email and username

    @NotBlank(message = "Password is required")
    private String password;

    // Manual getters and setters for compilation if Lombok fails
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
}