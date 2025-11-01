package com.autoserve.controller;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.Service;
import com.autoserve.entity.Vehicle;
import com.autoserve.service.AppointmentService;
import com.autoserve.service.ServiceService;
import com.autoserve.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerAppointmentController {

    private final AppointmentService appointmentService;
    private final ServiceService serviceService;
    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<Appointment>> getMyAppointments() {
        return ResponseEntity.ok(appointmentService.getMyAppointments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment createdAppointment = appointmentService.createAppointment(appointment);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointment(id, appointment);
            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // New endpoint to get all available services
    @GetMapping("/services")
    public ResponseEntity<List<Service>> getAvailableServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    // New endpoint to get customer's vehicles
    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getMyVehicles() {
        return ResponseEntity.ok(vehicleService.getMyVehicles());
    }
}
