package com.autoserve.dto.Auth;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String email;
    private String password;
}