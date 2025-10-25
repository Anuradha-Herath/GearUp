package com.autoserve.controller;

import com.autoserve.dto.Auth.LoginRequest;
import com.autoserve.dto.Auth.JwtResponse;
import com.autoserve.dto.Auth.SignupRequest;
import com.autoserve.entity.User;
import com.autoserve.repository.UserRepository;
import com.autoserve.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            authService.signup(signupRequest);
            return ResponseEntity.ok("User registered successfully! Please check your email to verify your account before logging in.");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Registration failed: Unable to send verification email. " + e.getMessage());
        }
    }

    @GetMapping("/verify")
    public String verifyAccount(@RequestParam("code") String code) {
        User user = userRepository.findByVerificationCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid verification code"));

        user.setEnabled(true);
        user.setVerificationCode(null);
        userRepository.save(user);

        return "Account verified successfully!";
    }

}