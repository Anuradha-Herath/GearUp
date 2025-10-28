package com.autoserve.service;

import com.autoserve.entity.User;
import com.autoserve.entity.Employee;
import com.autoserve.repository.UserRepository;
import com.autoserve.repository.EmployeeRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public UserDetailsServiceImpl(UserRepository userRepository, EmployeeRepository employeeRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Try to find user by email first, then by username
        User user = userRepository.findByEmail(usernameOrEmail)
                .orElse(userRepository.findByUsername(usernameOrEmail).orElse(null));

        if (user != null) {
            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .roles(user.getRole())
                    .disabled(!user.isEnabled()) // Account disabled if not verified
                    .build();
        }

        // If not found in users table, try employees table
        Employee employee = employeeRepository.findByEmail(usernameOrEmail);
        if (employee == null) {
            employee = employeeRepository.findByUsername(usernameOrEmail);
        }

        if (employee != null) {
            return org.springframework.security.core.userdetails.User.builder()
                    .username(employee.getUsername())
                    .password(employee.getPassword())
                    .roles(employee.getRole().toUpperCase())
                    .build();
        }

        throw new UsernameNotFoundException("User not found: " + usernameOrEmail);
    }
}