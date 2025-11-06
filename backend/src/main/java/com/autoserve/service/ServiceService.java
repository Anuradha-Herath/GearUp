package com.autoserve.service;

import com.autoserve.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {
    
    private final ServiceRepository serviceRepository;
    
    @Autowired
    private VectorDBService vectorDBService;

    public List<com.autoserve.entity.Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public Optional<com.autoserve.entity.Service> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public com.autoserve.entity.Service createService(com.autoserve.entity.Service service) {
        com.autoserve.entity.Service savedService = serviceRepository.save(service);
        // Sync to vector DB
        vectorDBService.addService(savedService);
        return savedService;
    }

    public com.autoserve.entity.Service updateService(Long id, com.autoserve.entity.Service serviceDetails) {
        com.autoserve.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        
        service.setTitle(serviceDetails.getTitle());
        service.setShortDescription(serviceDetails.getShortDescription());
        service.setImage(serviceDetails.getImage());
        service.setIncludedSubservices(serviceDetails.getIncludedSubservices());
        service.setEstimatedDuration(serviceDetails.getEstimatedDuration());
        service.setEstimatedPrice(serviceDetails.getEstimatedPrice());
        service.setMaxPerDay(serviceDetails.getMaxPerDay());
        
        com.autoserve.entity.Service updatedService = serviceRepository.save(service);
        // Sync to vector DB
        vectorDBService.updateService(updatedService);
        return updatedService;
    }

    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        serviceRepository.deleteById(id);
        // Remove from vector DB
        vectorDBService.deleteService(id);
    }
}
