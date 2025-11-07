package com.autoserve.controller;

import com.autoserve.entity.User;
import com.autoserve.repository.UserRepository;
import com.autoserve.repository.AppointmentRepository;
import com.autoserve.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeCustomerController {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final VehicleRepository vehicleRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCustomers(@org.springframework.web.bind.annotation.RequestParam(required = false) String startDate,
                                                                       @org.springframework.web.bind.annotation.RequestParam(required = false) String endDate) {
        java.time.LocalDate sd = startDate != null && !startDate.isBlank() ? java.time.LocalDate.parse(startDate) : null;
        java.time.LocalDate ed = endDate != null && !endDate.isBlank() ? java.time.LocalDate.parse(endDate) : null;

        List<User> customers = userRepository.findByRole("CUSTOMER");
        
        List<Map<String, Object>> customerDetails = customers.stream().map(customer -> {
            Map<String, Object> details = new HashMap<>();
            details.put("id", customer.getId());
            details.put("name", customer.getUsername());
            details.put("email", customer.getEmail());
            details.put("phone", customer.getPhoneNumber() != null ? customer.getPhoneNumber() : "Not provided");
            details.put("username", customer.getUsername());
            
            // Count total bookings for this customer (apply optional date filter)
            long totalBookings;
            if (sd != null || ed != null) {
                List<com.autoserve.entity.Appointment> appts = appointmentRepository.findByCustomerId(customer.getId());
                totalBookings = appts.stream()
                        .filter(a -> {
                            if (a.getDate() == null) return false;
                            if (sd != null && a.getDate().isBefore(sd)) return false;
                            if (ed != null && a.getDate().isAfter(ed)) return false;
                            return true;
                        }).count();
            } else {
                totalBookings = appointmentRepository.countByCustomerId(customer.getId());
            }
            details.put("totalBookings", totalBookings);
            
            // Count vehicles for this customer
            long vehicleCount = vehicleRepository.countByCustomerId(customer.getId());
            details.put("vehicleCount", vehicleCount);
            
            return details;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(customerDetails);
    }
}
