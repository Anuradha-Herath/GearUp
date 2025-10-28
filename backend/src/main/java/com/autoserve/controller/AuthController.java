package com.autoserve.controller;

import com.autoserve.dto.Auth.LoginRequest;
import com.autoserve.dto.Auth.JwtResponse;
import com.autoserve.dto.Auth.SignupRequest;
import com.autoserve.dto.Auth.ForgotPasswordRequest;
import com.autoserve.dto.Auth.ResetPasswordRequest;
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
            String message = authService.signup(signupRequest);
            return ResponseEntity.ok(message);
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