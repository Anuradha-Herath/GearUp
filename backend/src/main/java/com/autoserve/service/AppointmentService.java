package com.autoserve.service;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.TimeLog;
import com.autoserve.entity.User;
import com.autoserve.entity.Vehicle;
import com.autoserve.repository.AppointmentRepository;
import com.autoserve.repository.TimeLogRepository;
import com.autoserve.repository.UserRepository;
import com.autoserve.repository.VehicleRepository;
import com.autoserve.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final ServiceRepository serviceRepository;
    private final TimeLogRepository timeLogRepository;

    @Transactional
    public List<Appointment> getMyAppointments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Appointment> appointments = appointmentRepository.findByCustomer(user);
        
        // Explicitly load time logs for each appointment
        appointments.forEach(appointment -> {
            appointment.getTimeLogs().size(); // This triggers lazy loading
        });
        
        return appointments;
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

    @Transactional
    public Appointment updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        // Validate status
        if (!isValidStatus(status)) {
            throw new RuntimeException("Invalid status: " + status);
        }
        
        String upperStatus = status.toUpperCase();
        String currentStatus = appointment.getStatus();
        
        // Get current authenticated user (employee) if available
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication != null ? authentication.getName() : null;
        User employee = null;
        
        // Only get employee if username is valid and not anonymous
        if (username != null && !"anonymousUser".equals(username)) {
            employee = userRepository.findByUsername(username).orElse(null);
        }
        
        System.out.println("Updating appointment status from " + currentStatus + " to " + upperStatus);
        if (employee != null) {
            System.out.println("Employee: " + employee.getUsername() + " (ID: " + employee.getId() + ")");
        } else {
            System.out.println("No authenticated employee found - TIME LOGS WILL NOT BE CREATED");
        }
        System.out.println("Appointment ID: " + appointment.getId());
        
        // Handle time logging based on status transitions (only if employee is authenticated)
        if (employee != null && "ONGOING".equals(upperStatus) && !"ONGOING".equals(currentStatus)) {
            // Starting work - create time log with start time
            System.out.println("=== CREATING TIME LOG ===");
            System.out.println("Employee ID: " + employee.getId());
            System.out.println("Appointment ID: " + appointment.getId());
            System.out.println("Start Time: " + LocalDateTime.now());
            
            try {
                TimeLog timeLog = new TimeLog();
                timeLog.setAppointment(appointment);
                timeLog.setEmployee(employee);
                timeLog.setStartTime(LocalDateTime.now());
                timeLog.setDescription("Work started on " + appointment.getService().getTitle());
                
                System.out.println("TimeLog object created, about to save...");
                System.out.println("TimeLog - Employee: " + (timeLog.getEmployee() != null ? timeLog.getEmployee().getId() : "NULL"));
                System.out.println("TimeLog - Appointment: " + (timeLog.getAppointment() != null ? timeLog.getAppointment().getId() : "NULL"));
                System.out.println("TimeLog - StartTime: " + timeLog.getStartTime());
                System.out.println("TimeLog - Description: " + timeLog.getDescription());
                
                TimeLog savedTimeLog = timeLogRepository.save(timeLog);
                timeLogRepository.flush(); // Force immediate persistence
                
                System.out.println("=== TIME LOG SAVED SUCCESSFULLY ===");
                System.out.println("Saved TimeLog ID: " + savedTimeLog.getId());
                System.out.println("Saved TimeLog Employee ID: " + savedTimeLog.getEmployee().getId());
                System.out.println("Saved TimeLog Appointment ID: " + savedTimeLog.getAppointment().getId());
                System.out.println("Saved TimeLog Start Time: " + savedTimeLog.getStartTime());
            } catch (Exception e) {
                System.err.println("=== ERROR SAVING TIME LOG ===");
                System.err.println("Error: " + e.getMessage());
                e.printStackTrace();
            }
            
        } else if (employee != null && "FINISHED".equals(upperStatus) && "ONGOING".equals(currentStatus)) {
            // Finishing work - update time log with end time
            System.out.println("Finding time log to finish...");
            List<TimeLog> timeLogs = timeLogRepository.findByAppointmentIdAndEndTimeIsNull(id);
            System.out.println("Found " + timeLogs.size() + " time logs to finish");
            
            if (!timeLogs.isEmpty()) {
                TimeLog timeLog = timeLogs.get(0);
                timeLog.setEndTime(LocalDateTime.now());
                timeLog.setDescription(timeLog.getDescription() + " - Completed");
                
                TimeLog updatedTimeLog = timeLogRepository.save(timeLog);
                System.out.println("Time log updated with ID: " + updatedTimeLog.getId());
                System.out.println("End time: " + updatedTimeLog.getEndTime());
            }
        }
        
        appointment.setStatus(upperStatus);
        return appointmentRepository.save(appointment);
    }

    private boolean isValidStatus(String status) {
        return List.of("REQUESTED", "CONFIRMED", "PENDING", "ONGOING", "FINISHED", "CANCELLED")
                .contains(status.toUpperCase());
    }
}