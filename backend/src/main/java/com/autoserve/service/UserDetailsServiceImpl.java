package com.autoserve.service;

import com.autoserve.entity.User;
import com.autoserve.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Try to find user by email first, then by username
        User user = userRepository.findByEmail(usernameOrEmail)
                .orElse(userRepository.findByUsername(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrEmail)));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole())
                .disabled(!user.isEnabled()) // Account disabled if not verified
                .build();
    }
}