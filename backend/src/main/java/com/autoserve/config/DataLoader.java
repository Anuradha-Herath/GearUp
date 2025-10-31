package com.autoserve.config;

import com.autoserve.entity.User;
import com.autoserve.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only load data if no users exist
        if (userRepository.count() == 0) {
            loadTestUsers();
        }
    }

    private void loadTestUsers() {
        // Create test user 1 - samadhigamaarachchi0@gmail.com
        User user1 = new User();
        user1.setUsername("samadhi");
        user1.setEmail("samadhigamaarachchi0@gmail.com");
        user1.setPassword(passwordEncoder.encode("password123"));
        user1.setRole("USER");
        user1.setEnabled(true); // Enable for testing
        user1.setVerificationCode(null); // No verification needed for test data
        userRepository.save(user1);

        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@autoserve.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        admin.setEnabled(true);
        admin.setVerificationCode(null);
        userRepository.save(admin);

        // Create employee user
        User employee = new User();
        employee.setUsername("employee");
        employee.setEmail("employee@autoserve.com");
        employee.setPassword(passwordEncoder.encode("employee123"));
        employee.setRole("EMPLOYEE");
        employee.setEnabled(true);
        employee.setVerificationCode(null);
        userRepository.save(employee);

        System.out.println("✅ Test users loaded:");
        System.out.println("📧 samadhigamaarachchi0@gmail.com (password: password123)");
        System.out.println("👤 admin@autoserve.com (password: admin123)");
        System.out.println("⚙️ employee@autoserve.com (password: employee123)");
    }
}