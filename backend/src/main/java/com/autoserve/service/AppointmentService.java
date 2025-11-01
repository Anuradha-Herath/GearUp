package com.autoserve.service;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.User;
import com.autoserve.entity.Vehicle;
import com.autoserve.repository.AppointmentRepository;
import com.autoserve.repository.UserRepository;
import com.autoserve.repository.VehicleRepository;
import com.autoserve.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final ServiceRepository serviceRepository;

    public List<Appointment> getMyAppointments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return appointmentRepository.findByCustomer(user);
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment createAppointment(Appointment appointment) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify vehicle belongs to user
        Vehicle vehicle = vehicleRepository.findById(appointment.getVehicle().getId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        if (!vehicle.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Vehicle does not belong to user");
        }
        
        // Verify service exists
        com.autoserve.entity.Service service = serviceRepository.findById(appointment.getService().getId())
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        appointment.setCustomer(user);
        appointment.setVehicle(vehicle);
        appointment.setService(service);
        appointment.setEstimatedCost(service.getEstimatedPrice());
        appointment.setStatus("REQUESTED");
        
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Ensure the appointment belongs to the logged-in user
        if (!appointment.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to appointment");
        }
        
        appointment.setDate(appointmentDetails.getDate());
        appointment.setTime(appointmentDetails.getTime());
        appointment.setAdditionalNote(appointmentDetails.getAdditionalNote());
        
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        // Ensure the appointment belongs to the logged-in user
        if (!appointment.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to appointment");
        }
        
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Employee-specific methods
    public List<Appointment> getPendingAppointments() {
        return appointmentRepository.findByStatus("REQUESTED");
    }

    public List<Appointment> getConfirmedAppointments() {
        return appointmentRepository.findByStatus("CONFIRMED");
    }

    public Appointment updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        // Validate status
        if (!isValidStatus(status)) {
            throw new RuntimeException("Invalid status: " + status);
        }
        
        appointment.setStatus(status.toUpperCase());
        return appointmentRepository.save(appointment);
    }

    private boolean isValidStatus(String status) {
        return List.of("REQUESTED", "CONFIRMED", "PENDING", "ONGOING", "FINISHED", "CANCELLED")
                .contains(status.toUpperCase());
    }
}