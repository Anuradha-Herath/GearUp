package com.autoserve.service;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import com.autoserve.dto.Auth.LoginRequest;
import com.autoserve.dto.Auth.JwtResponse;
import com.autoserve.dto.Auth.SignupRequest;
import com.autoserve.entity.User;
import com.autoserve.entity.Employee;
import com.autoserve.repository.UserRepository;
import com.autoserve.repository.EmployeeRepository;
import com.autoserve.util.JwtUtil;

import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final MailService mailService;

    @Value("${app.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, 
                       PasswordEncoder passwordEncoder, UserRepository userRepository, 
                       EmployeeRepository employeeRepository, MailService mailService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.mailService = mailService;
    }

    public JwtResponse login(LoginRequest loginRequest) {
        try {
            // Get the login identifier (email or username)
            String loginIdentifier = loginRequest.getLoginIdentifier();
            
            logger.info("[LOGIN] Attempting login with identifier: {}", loginIdentifier);
            
            if (loginIdentifier == null || loginIdentifier.isBlank()) {
                throw new RuntimeException("Email or username is required");
            }

            // First check if user/employee exists before authentication
            String email = loginRequest.getEmail();
            String username = loginRequest.getUsername();
            User user = null;
            Employee employee = null;

            if (email != null && !email.isBlank()) {
                user = userRepository.findByEmailIgnoreCase(email).orElse(null);
                if (user == null) {
                    employee = employeeRepository.findByEmail(email);
                }
            } else if (username != null && !username.isBlank()) {
                user = userRepository.findByUsername(username).orElse(null);
                if (user == null) {
                    employee = employeeRepository.findByUsername(username);
                }
            }

            logger.info("[LOGIN] Found user: {}, Found employee: {}", user != null, employee != null);
            
            if (user == null && employee == null) {
                logger.error("[LOGIN] No user or employee found with identifier: {}", loginIdentifier);
                throw new RuntimeException("User not found");
            }

            // Use the authentication manager to handle both users and employees
            try {
                System.out.println("[LOGIN_SERVICE] About to authenticate with: " + loginIdentifier);
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginIdentifier, loginRequest.getPassword()));

                System.out.println("[LOGIN_SERVICE] Authentication successful, setting context");
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                System.out.println("[LOGIN_SERVICE] About to generate JWT token");
                String jwt = jwtUtil.generateToken(authentication);
                System.out.println("[LOGIN_SERVICE] JWT token generated successfully");

                // Return appropriate response based on what we found
                if (user != null) {
                    logger.info("[LOGIN] Successful login for user: {}", user.getEmail());
                    System.out.println("[LOGIN_SERVICE] Creating JwtResponse for user: " + user.getEmail());
                    JwtResponse response = new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getRole());
                    System.out.println("[LOGIN_SERVICE] JwtResponse created successfully");
                    return response;
                } else if (employee != null) {
                    logger.info("[LOGIN] Successful login for employee: {}", employee.getEmail());
                    System.out.println("[LOGIN_SERVICE] Creating JwtResponse for employee: " + employee.getEmail());
                    JwtResponse response = new JwtResponse(jwt, employee.getId(), employee.getUsername(), employee.getEmail(), employee.getRole().toUpperCase());
                    System.out.println("[LOGIN_SERVICE] JwtResponse created successfully");
                    return response;
                }
            } catch (BadCredentialsException e) {
                logger.error("[LOGIN] Bad credentials for identifier: {}", loginIdentifier);
                System.out.println("[LOGIN_SERVICE] BadCredentialsException: " + e.getMessage());
                throw new RuntimeException("Invalid email or password");
            } catch (Exception e) {
                logger.error("[LOGIN] Unexpected error during authentication: {}", e.getMessage());
                System.out.println("[LOGIN_SERVICE] Unexpected exception: " + e.getClass().getSimpleName() + " - " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Authentication failed: " + e.getMessage());
            }
            
            throw new RuntimeException("Login failed");
            
        } catch (Exception e) {
            logger.error("[LOGIN] Error: {}", e.getMessage());
            throw new RuntimeException("Invalid email or password");
        }
    }

    public String signup(SignupRequest signupRequest) throws IOException {
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
    // Always require verification and generate a non-null code
    user.setEnabled(false);
    user.setVerificationCode(UUID.randomUUID().toString());

        userRepository.save(user);

    String subject = "Welcome to AutoServe! 🚗";

        // HTML email content with clickable link
    String verifyUrl = frontendBaseUrl + "/verify?code=" + user.getVerificationCode();
    logger.info("Verification URL for {}: {}", user.getEmail(), verifyUrl);

    String htmlContent =
                "<!DOCTYPE html>" +
                "<html><body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;'>" +
                "<h2 style='color: #333;'>Welcome to AutoServe! 🚗</h2>" +
                "<p>Hello <strong>" + user.getUsername() + "</strong>,</p>" +
                "<p>We're excited to have you join the AutoServe community! 🎉</p>" +
                "<p>To keep your account secure, please verify your email address by clicking the button below:</p>" +
                "<p style='text-align: center; margin: 30px 0;'>" +
                "<a href='" + verifyUrl + "' " +
                "style='background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Verify My Account</a></p>" +
                "<p>Once verified, you'll be ready to explore all the features we offer.</p>" +
                "<p>If you didn’t sign up for AutoServe, you can safely ignore this email.</p>" +
                "<p>Best regards,<br><strong>The AutoServe Team</strong></p>" +
                "<hr>" +
                "<p style='font-size: 12px; color: #777;'>This is an automated message from AutoServe. Please do not reply.</p>" +
                "</div></body></html>";

        mailService.sendVerificationEmail(user.getEmail(), subject, htmlContent);
        
        return "User registered successfully! Please check your email to verify your account before logging in.";
    }

    public void forgotPassword(String email) throws IOException {
        // Try to find user first
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        // If user not found, try to find employee
        Employee employee = null;
        if (userOpt.isEmpty()) {
            employee = employeeRepository.findByEmail(email);
            if (employee == null) {
                throw new RuntimeException("No account found with this email address");
            }
        }

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        long tokenExpiry = System.currentTimeMillis() + (24 * 60 * 60 * 1000); // 24 hours from now

        String userName;
        if (userOpt.isPresent()) {
            // Handle user password reset
            User user = userOpt.get();
            user.setResetPasswordToken(resetToken);
            user.setResetPasswordTokenExpiry(tokenExpiry);
            userRepository.save(user);
            userName = user.getUsername();
        } else {
            // Handle employee password reset
            employee.setResetPasswordToken(resetToken);
            employee.setResetPasswordTokenExpiry(tokenExpiry);
            employeeRepository.save(employee);
            userName = employee.getName();
        }

        // Send password reset email
        String subject = "AutoServe - Password Reset Request";

    String resetUrl = frontendBaseUrl + "/reset-password?token=" + resetToken;
    logger.info("Password reset URL for {}: {}", email, resetUrl);

    String htmlContent =
                "<!DOCTYPE html>" +
                "<html><body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;'>" +
                "<h2 style='color: #333;'>Password Reset Request 🔒</h2>" +
                "<p>Hello <strong>" + userName + "</strong>,</p>" +
                "<p>We received a request to reset your AutoServe account password.</p>" +
                "<p>To reset your password, click the button below:</p>" +
                "<p style='text-align: center; margin: 30px 0;'>" +
                "<a href='" + resetUrl + "' " +
                "style='background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Reset My Password</a></p>" +
                "<p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>" +
                "<p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>" +
                "<p>Best regards,<br><strong>The AutoServe Team</strong></p>" +
                "<hr>" +
                "<p style='font-size: 12px; color: #777;'>This is an automated message from AutoServe. Please do not reply.</p>" +
                "</div></body></html>";

        mailService.sendVerificationEmail(email, subject, htmlContent);
    }

    public void resetPassword(String token, String newPassword) {
        // Try to find user with token first
        Optional<User> userOpt = userRepository.findByResetPasswordToken(token);
        
        if (userOpt.isPresent()) {
            // Handle user password reset
            User user = userOpt.get();
            
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
        } else {
            // Try to find employee with token
            Optional<Employee> employeeOpt = employeeRepository.findByResetPasswordToken(token);
            if (employeeOpt.isEmpty()) {
                throw new RuntimeException("Invalid or expired reset token");
            }
            
            Employee employee = employeeOpt.get();
            
            // Check if token is expired
            if (employee.getResetPasswordTokenExpiry() == null || 
                System.currentTimeMillis() > employee.getResetPasswordTokenExpiry()) {
                throw new RuntimeException("Reset token has expired. Please request a new password reset.");
            }

            // Update password and clear reset token
            employee.setPassword(passwordEncoder.encode(newPassword));
            employee.setResetPasswordToken(null);
            employee.setResetPasswordTokenExpiry(null);
            employeeRepository.save(employee);
        }
    }
}
