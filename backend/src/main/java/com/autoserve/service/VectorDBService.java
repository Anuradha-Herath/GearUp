package com.autoserve.service;

import com.autoserve.entity.Appointment;
import com.autoserve.entity.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

import java.util.*;

@Component
public class VectorDBService {

    @Autowired
    private SimpleVectorStore vectorStore;

    @Autowired
    private com.autoserve.repository.ServiceRepository serviceRepository;
    
    @Autowired
    private com.autoserve.repository.AppointmentRepository appointmentRepository;

    @PostConstruct
    public void init() {
        try {
            // Initialize knowledge base with static information
            initializeKnowledgeBase();
            
            // Load existing services from database
            loadExistingServices();
            
            // Load existing appointments from database
            loadExistingAppointments();
            
            System.out.println("✅ Vector database initialized successfully (in-memory mode)");
        } catch (Exception e) {
            System.err.println("Error initializing vector database: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void loadExistingServices() {
        try {
            java.util.List<Service> services = serviceRepository.findAll();
            for (Service service : services) {
                addService(service);
            }
            System.out.println("✅ Loaded " + services.size() + " existing services into vector database");
        } catch (Exception e) {
            System.err.println("Error loading existing services: " + e.getMessage());
        }
    }
    
    private void loadExistingAppointments() {
        try {
            java.util.List<Appointment> appointments = appointmentRepository.findAll();
            for (Appointment appointment : appointments) {
                addAppointment(appointment);
            }
            System.out.println("✅ Loaded " + appointments.size() + " existing appointments into vector database");
        } catch (Exception e) {
            System.err.println("Error loading existing appointments: " + e.getMessage());
        }
    }

    private void initializeKnowledgeBase() {
        try {
            List<String> documents = Arrays.asList(
                "AutoServe is an automobile service management system that helps customers book vehicle services and manage appointments.",
                "Available appointment statuses: REQUESTED (newly created), CONFIRMED (approved by admin), PENDING (waiting to start), ONGOING (service in progress), FINISHED (completed), CANCELLED (cancelled by customer or admin).",
                "Customers can book appointments by selecting a service, vehicle, date and time. They can also cancel appointments.",
                "Services include details like title, description, estimated duration, estimated price, and maximum bookings per day.",
                "Each appointment requires a customer, vehicle, service, date, and time. Employees (mechanics) are assigned by admins.",
                "Customers can view their appointment history and track the status of current appointments.",
                "The system supports multiple vehicles per customer and tracks vehicle information.",
                "Business hours and service availability depend on the maximum bookings per day for each service.",
                "Customers receive notifications about appointment status changes via email.",
                "The platform provides real-time updates through WebSocket connections for appointment status changes."
            );
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("type", "knowledge_base");
            
            for (int i = 0; i < documents.size(); i++) {
                vectorStore.addDocument("kb_" + i, documents.get(i), metadata);
            }
            
            System.out.println("✅ Knowledge base initialized with " + documents.size() + " documents");
        } catch (Exception e) {
            System.err.println("Error initializing knowledge base: " + e.getMessage());
        }
    }

    public void addService(Service service) {
        try {
            String document = String.format(
                "Service: %s. Description: %s. Subservices: %s. Duration: %s. Price: $%.2f. Max bookings per day: %d",
                service.getTitle(),
                service.getShortDescription(),
                service.getIncludedSubservices(),
                service.getEstimatedDuration(),
                service.getEstimatedPrice(),
                service.getMaxPerDay()
            );
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("service_id", service.getId());
            metadata.put("title", service.getTitle());
            metadata.put("price", service.getEstimatedPrice());
            metadata.put("type", "service");
            
            vectorStore.addDocument("service_" + service.getId(), document, metadata);
        } catch (Exception e) {
            System.err.println("Error adding service to vector DB: " + e.getMessage());
        }
    }

    public void updateService(Service service) {
        try {
            addService(service); // Will overwrite existing document
        } catch (Exception e) {
            System.err.println("Error updating service in vector DB: " + e.getMessage());
        }
    }

    public void deleteService(Long serviceId) {
        try {
            vectorStore.deleteDocument("service_" + serviceId);
        } catch (Exception e) {
            System.err.println("Error deleting service from vector DB: " + e.getMessage());
        }
    }

    public void addAppointment(Appointment appointment) {
        try {
            String document = String.format(
                "Appointment ID: %d. Customer: %s. Service: %s. Vehicle: %s %s. Date: %s. Time: %s. Status: %s. Cost: $%.2f. Notes: %s",
                appointment.getId(),
                appointment.getCustomer().getUsername(),
                appointment.getService().getTitle(),
                appointment.getVehicle().getCompany(),
                appointment.getVehicle().getModel(),
                appointment.getDate(),
                appointment.getTime(),
                appointment.getStatus(),
                appointment.getEstimatedCost(),
                appointment.getAdditionalNote() != null ? appointment.getAdditionalNote() : "None"
            );
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("appointment_id", appointment.getId());
            metadata.put("customer_id", appointment.getCustomer().getId());
            metadata.put("service_id", appointment.getService().getId());
            metadata.put("status", appointment.getStatus());
            metadata.put("date", appointment.getDate().toString());
            metadata.put("type", "appointment");
            
            vectorStore.addDocument("appointment_" + appointment.getId(), document, metadata);
        } catch (Exception e) {
            System.err.println("Error adding appointment to vector DB: " + e.getMessage());
        }
    }

    public void updateAppointment(Appointment appointment) {
        try {
            addAppointment(appointment); // Will overwrite existing document
        } catch (Exception e) {
            System.err.println("Error updating appointment in vector DB: " + e.getMessage());
        }
    }

    public void deleteAppointment(Long appointmentId) {
        try {
            vectorStore.deleteDocument("appointment_" + appointmentId);
        } catch (Exception e) {
            System.err.println("Error deleting appointment from vector DB: " + e.getMessage());
        }
    }

    public List<String> searchRelevantContext(String query, int limit) {
        try {
            // Search across all documents (knowledge base, services, appointments)
            List<String> results = vectorStore.search(query, limit);
            System.out.println("Found " + results.size() + " relevant documents for query: " + query);
            return results;
        } catch (Exception e) {
            System.err.println("Error searching vector DB: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
