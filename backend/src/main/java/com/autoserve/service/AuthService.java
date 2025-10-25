package com.autoserve.service;

import java.io.IOException;
import java.util.UUID;

import com.autoserve.dto.Auth.LoginRequest;
import com.autoserve.dto.Auth.JwtResponse;
import com.autoserve.dto.Auth.SignupRequest;
import com.autoserve.entity.User;
import com.autoserve.repository.UserRepository;
import com.autoserve.util.JwtUtil;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final MailService mailService;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, 
                       PasswordEncoder passwordEncoder, UserRepository userRepository, 
                       MailService mailService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    public JwtResponse login(LoginRequest loginRequest) {
        try {
            User user = userRepository.findByEmail(loginRequest.getUsername())
                    .orElse(userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found")));

            if (!user.isEnabled()) {
                throw new RuntimeException("Account not verified. Please check your email and verify your account.");
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtil.generateToken(authentication);

            return new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail());
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email/username or password");
        }
    }

    public void signup(SignupRequest signupRequest) throws IOException {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        if (signupRequest.getUsername().length() < 3) {
            throw new RuntimeException("Username must be at least 3 characters long");
        }

        if (signupRequest.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setRole("USER");
        user.setEnabled(false);
        user.setVerificationCode(UUID.randomUUID().toString());

        userRepository.save(user);

        String subject = "Welcome to AutoServe! 🚗";

        // HTML email content with clickable link
        String htmlContent =
                "<!DOCTYPE html>" +
                "<html><body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;'>" +
                "<h2 style='color: #333;'>Welcome to AutoServe! 🚗</h2>" +
                "<p>Hello <strong>" + user.getUsername() + "</strong>,</p>" +
                "<p>We're excited to have you join the AutoServe community! 🎉</p>" +
                "<p>To keep your account secure, please verify your email address by clicking the button below:</p>" +
                "<p style='text-align: center; margin: 30px 0;'>" +
                "<a href='http://localhost:8080/api/auth/verify?code=" + user.getVerificationCode() + "' " +
                "style='background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Verify My Account</a></p>" +
                "<p>Once verified, you'll be ready to explore all the features we offer.</p>" +
                "<p>If you didn’t sign up for AutoServe, you can safely ignore this email.</p>" +
                "<p>Best regards,<br><strong>The AutoServe Team</strong></p>" +
                "<hr>" +
                "<p style='font-size: 12px; color: #777;'>This is an automated message from AutoServe. Please do not reply.</p>" +
                "</div></body></html>";

        mailService.sendVerificationEmail(user.getEmail(), subject, htmlContent);
    }

    public void forgotPassword(String email) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email address"));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        long tokenExpiry = System.currentTimeMillis() + (24 * 60 * 60 * 1000); // 24 hours from now

        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(tokenExpiry);
        userRepository.save(user);

        // Send password reset email
        String subject = "AutoServe - Password Reset Request";

        String htmlContent =
                "<!DOCTYPE html>" +
                "<html><body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;'>" +
                "<h2 style='color: #333;'>Password Reset Request 🔒</h2>" +
                "<p>Hello <strong>" + user.getUsername() + "</strong>,</p>" +
                "<p>We received a request to reset your AutoServe account password.</p>" +
                "<p>To reset your password, click the button below:</p>" +
                "<p style='text-align: center; margin: 30px 0;'>" +
                "<a href='http://localhost:3000/reset-password?token=" + resetToken + "' " +
                "style='background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Reset My Password</a></p>" +
                "<p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>" +
                "<p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>" +
                "<p>Best regards,<br><strong>The AutoServe Team</strong></p>" +
                "<hr>" +
                "<p style='font-size: 12px; color: #777;'>This is an automated message from AutoServe. Please do not reply.</p>" +
                "</div></body></html>";

        mailService.sendVerificationEmail(user.getEmail(), subject, htmlContent);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        // Check if token is expired
        if (user.getResetPasswordTokenExpiry() == null || 
            System.currentTimeMillis() > user.getResetPasswordTokenExpiry()) {
            throw new RuntimeException("Reset token has expired. Please request a new password reset.");
        }

        // Update password and clear reset token
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }
}
