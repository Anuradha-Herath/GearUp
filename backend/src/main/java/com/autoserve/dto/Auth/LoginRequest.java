package com.autoserve.dto.Auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}