package com.autoserve.service;

import com.autoserve.entity.Vehicle;
import com.autoserve.entity.User;
import com.autoserve.repository.VehicleRepository;
import com.autoserve.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class VehicleService {
    
    private static final Logger logger = LoggerFactory.getLogger(VehicleService.class);
    
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public List<Vehicle> getVehiclesByCustomer(Long customerId) {
        return vehicleRepository.findByCustomerId(customerId);
    }

    public List<Vehicle> getMyVehicles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        logger.info("Getting vehicles for authenticated user");
        logger.info("Authentication: {}", authentication != null ? authentication.getName() : "null");
        
        if (authentication == null) {
            logger.error("No authentication found in SecurityContext");
            throw new RuntimeException("No authentication found");
        }
        
        String username = authentication.getName();
        logger.info("Looking up user by username: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("User not found for username: {}", username);
                    return new RuntimeException("User not found");
                });
        
        logger.info("Found user with ID: {}", user.getId());
        List<Vehicle> vehicles = vehicleRepository.findByCustomer(user);
        logger.info("Found {} vehicles for user", vehicles.size());
        
        return vehicles;
    }

    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        vehicle.setCustomer(user);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        
        // Ensure the vehicle belongs to the logged-in user
        if (!vehicle.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to vehicle");
        }
        
        vehicle.setCompany(vehicleDetails.getCompany());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setYear(vehicleDetails.getYear());
        vehicle.setVehicleNumber(vehicleDetails.getVehicleNumber());
        
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        
        // Ensure the vehicle belongs to the logged-in user
        if (!vehicle.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to vehicle");
        }
        
        vehicleRepository.deleteById(id);
    }
}
