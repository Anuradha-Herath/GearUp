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
                
                "APPOINTMENT STATUSES EXPLAINED:\n" +
                "1. REQUESTED - Your appointment has been submitted and is waiting for admin approval\n" +
                "2. CONFIRMED - Admin has approved your appointment and it's scheduled\n" +
                "3. PENDING - Your appointment is confirmed and waiting to start on the scheduled date\n" +
                "4. ONGOING - The mechanic is currently working on your vehicle\n" +
                "5. FINISHED - The service is complete and your vehicle is ready\n" +
                "6. CANCELLED - The appointment was cancelled by you or the admin\n" +
                "You can view your appointment status at: http://localhost:5173/customer/my-bookings",
                
                "HOW TO BOOK AN APPOINTMENT:\n" +
                "1. Go to http://localhost:5173/customer/book-appointment\n" +
                "2. Select your vehicle\n" +
                "3. Choose a service\n" +
                "4. Pick a date and time\n" +
                "5. Add any notes\n" +
                "6. Submit - your appointment will be REQUESTED status\n" +
                "7. Wait for admin to CONFIRM it",
                
                "HOW TO CANCEL AN APPOINTMENT:\n" +
                "1. Go to http://localhost:5173/customer/my-bookings\n" +
                "2. Find the appointment you want to cancel\n" +
                "3. Click the cancel/delete button\n" +
                "4. Confirm the cancellation\n" +
                "5. The appointment status will change to CANCELLED\n" +
                "Note: You can only cancel appointments that haven't been completed yet.",
                
                "SERVICES INFORMATION:\n" +
                "Each service includes: title, description, estimated duration, estimated price, and maximum bookings per day.\n" +
                "You can view all services at: http://localhost:5173/customer/services\n" +
                "Click on any service to see full details at: http://localhost:5173/service/[id]",
                
                "PRICING:\n" +
                "All services have an estimated price listed.\n" +
                "Prices are shown in USD ($).\n" +
                "The final cost may vary based on actual work required.\n" +
                "You can see prices when browsing services or asking about specific services.",
                
                "Each appointment requires a customer, vehicle, service, date, and time. Employees (mechanics) are assigned by admins.",
                
                "Customers can view their appointment history and track the status of current appointments at http://localhost:5173/customer/my-bookings",
                
                "The system supports multiple vehicles per customer. You can manage your vehicles at http://localhost:5173/customer/my-vehicles",
                
                "Business hours and service availability depend on the maximum bookings per day for each service.",
                
                "Customers receive notifications about appointment status changes via email.",
                
                "The platform provides real-time updates through WebSocket connections for appointment status changes.",
                
                "AUTOSERVE CONTACT INFORMATION:\n" +
                "Phone Number: 011234567\n" +
                "Call us at: 011234567\n" +
                "Contact number: 011234567\n" +
                "Telephone: 011234567\n" +
                "Mobile: 011234567\n" +
                "Location: [View our location on map](https://www.google.com/maps/search/?api=1&query=AutoServe+Auto+Service+Center)\n" +
                "Address: Click the map link above to see our location\n" +
                "We're here to help with all your vehicle needs!\n" +
                "For immediate assistance, call 011234567",
                
                "COMMON CAR ISSUES - GENERAL ADVICE:\n\n" +
                "STRANGE NOISES:\n" +
                "- Squealing from brakes: Brake pads may need replacement\n" +
                "- Grinding sounds: Could be brake rotors or transmission issues\n" +
                "- Knocking from engine: Check oil level, may need engine diagnostic\n" +
                "- Rattling from exhaust: Exhaust system may be loose or damaged\n" +
                "- Humming from tires: Check tire pressure and alignment\n\n" +
                "If you hear unusual sounds, it's best to get it checked soon. Browse our services at http://localhost:5173/customer/services to find the right service for your issue.",
                
                "ENGINE PROBLEMS:\n" +
                "- Check engine light on: Get an engine diagnostic scan\n" +
                "- Engine overheating: Check coolant level, may need radiator service\n" +
                "- Poor acceleration: Could be fuel system, spark plugs, or air filter\n" +
                "- Engine won't start: This is often caused by a dead battery, faulty starter, or fuel system issues. Try jump-starting the battery first. If that doesn't work, it may need professional diagnosis.\n" +
                "- Car not starting: Common causes include dead battery (most common), bad starter motor, empty fuel tank, or ignition system problems. Check if lights/radio work - if not, it's likely the battery.\n" +
                "- Low fuel consumption/Poor fuel economy: Could be dirty air filter, worn spark plugs, low tire pressure, or engine issues. Regular maintenance helps improve fuel efficiency.\n\n" +
                "We offer engine diagnostics and repairs. View our services: http://localhost:5173/customer/services",
                
                "BRAKE ISSUES:\n" +
                "- Soft brake pedal: May need brake fluid or brake line service\n" +
                "- Brake warning light: Get brakes inspected immediately\n" +
                "- Vibration when braking: Rotors may be warped\n" +
                "- Pulling to one side: Brake caliper or alignment issue\n\n" +
                "Safety first! Check our brake services: http://localhost:5173/customer/services",
                
                "TIRE PROBLEMS:\n" +
                "- Uneven tire wear: Need wheel alignment or tire rotation\n" +
                "- Low tire pressure: Check for leaks, inflate to proper PSI\n" +
                "- Vibration at high speed: Tires may need balancing\n" +
                "- Bulge or crack in tire: Replace tire immediately\n\n" +
                "We can help with tire services: http://localhost:5173/customer/services",
                
                "GENERAL MAINTENANCE TIPS:\n" +
                "- Oil change: Every 3,000-5,000 miles or as recommended\n" +
                "- Tire rotation: Every 5,000-7,500 miles\n" +
                "- Brake inspection: Every 10,000 miles or annually\n" +
                "- Battery check: Every 6 months, especially before winter\n" +
                "- Air filter: Replace every 12,000-15,000 miles\n\n" +
                "Regular maintenance prevents costly repairs! Book a service: http://localhost:5173/customer/book-appointment",
                
                "EMERGENCY SITUATIONS:\n" +
                "- Smoke from engine: Pull over safely, turn off engine, call for help\n" +
                "- Brake failure: Pump brakes, use emergency brake, downshift\n" +
                "- Flat tire: Pull over safely, use spare tire or call for assistance\n" +
                "- Overheating: Turn off AC, turn on heater, pull over when safe\n\n" +
                "For non-emergency service needs, contact us at 011234567 or book online: http://localhost:5173/customer/book-appointment"
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
                "Service Name: %s\n" +
                "Price: $%.2f\n" +
                "Duration: %s\n" +
                "Description: %s\n" +
                "What's Included: %s\n" +
                "Maximum bookings per day: %d\n" +
                "Service ID: %d\n" +
                "View details at: http://localhost:5173/service/%d",
                service.getTitle(),
                service.getEstimatedPrice(),
                service.getEstimatedDuration(),
                service.getShortDescription(),
                service.getIncludedSubservices() != null ? service.getIncludedSubservices() : "Standard service",
                service.getMaxPerDay(),
                service.getId(),
                service.getId()
            );
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("service_id", service.getId());
            metadata.put("title", service.getTitle());
            metadata.put("price", service.getEstimatedPrice());
            metadata.put("duration", service.getEstimatedDuration());
            metadata.put("type", "service");
            
            vectorStore.addDocument("service_" + service.getId(), document, metadata);
            System.out.println("✅ Added service to vector DB: " + service.getTitle() + " ($" + service.getEstimatedPrice() + ")");
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
            String statusExplanation = getStatusExplanation(appointment.getStatus());
            
            String document = String.format(
                "Appointment #%d\n" +
                "Customer: %s\n" +
                "Service: %s (Cost: $%.2f)\n" +
                "Vehicle: %s %s\n" +
                "Scheduled: %s at %s\n" +
                "Current Status: %s - %s\n" +
                "Additional Notes: %s\n" +
                "View at: http://localhost:5173/customer/my-bookings",
                appointment.getId(),
                appointment.getCustomer().getUsername(),
                appointment.getService().getTitle(),
                appointment.getEstimatedCost(),
                appointment.getVehicle().getCompany(),
                appointment.getVehicle().getModel(),
                appointment.getDate(),
                appointment.getTime(),
                appointment.getStatus(),
                statusExplanation,
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

    private String getStatusExplanation(String status) {
        switch (status.toUpperCase()) {
            case "REQUESTED":
                return "Waiting for admin approval";
            case "CONFIRMED":
                return "Approved and scheduled";
            case "PENDING":
                return "Confirmed, waiting to start";
            case "ONGOING":
                return "Service in progress";
            case "FINISHED":
                return "Service completed";
            case "CANCELLED":
                return "Appointment cancelled";
            default:
                return "Status unknown";
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
