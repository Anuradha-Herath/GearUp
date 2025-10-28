package com.autoserve.controller;

import com.autoserve.dto.Auth.LoginRequest;
import com.autoserve.dto.Auth.JwtResponse;
import com.autoserve.dto.Auth.SignupRequest;
import com.autoserve.dto.Auth.ForgotPasswordRequest;
import com.autoserve.dto.Auth.ResetPasswordRequest;
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
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("[LOGIN] Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            String message = authService.signup(signupRequest);
            return ResponseEntity.ok(message);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Registration failed: Unable to send verification email. " + e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<java.util.Map<String, Object>> verifyAccount(@RequestParam("code") String code) {
        System.out.println("[VERIFY] Received verification request for code=" + code);
        return userRepository.findByVerificationCode(code)
                .map(user -> {
                    user.setEnabled(true);
                    user.setVerificationCode(null);
                    userRepository.save(user);

                    java.util.Map<String, Object> body = new java.util.HashMap<>();
                    body.put("status", "success");
                    body.put("message", "Account verified successfully!");
                    System.out.println("[VERIFY] Account verified for user=" + user.getEmail());
                    return ResponseEntity.ok(body);
                })
                .orElseGet(() -> {
                    java.util.Map<String, Object> body = new java.util.HashMap<>();
                    body.put("status", "error");
                    body.put("message", "Invalid or expired verification link");
                    System.out.println("[VERIFY] Invalid verification code=" + code);
                    return ResponseEntity.badRequest().body(body);
                });
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<java.util.Map<String, Object>> verifyAccountPath(@PathVariable("code") String code) {
        // support path-style verification links as well
        return verifyAccount(code);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            authService.forgotPassword(request.getEmail());
            return ResponseEntity.ok("Password reset instructions have been sent to your email address.");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to send password reset email: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Password has been reset successfully. You can now login with your new password.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}