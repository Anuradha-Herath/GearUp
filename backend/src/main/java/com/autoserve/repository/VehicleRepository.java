package com.autoserve.repository;

import com.autoserve.entity.Vehicle;
import com.autoserve.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByCustomer(User customer);
    List<Vehicle> findByCustomerId(Long customerId);
}
