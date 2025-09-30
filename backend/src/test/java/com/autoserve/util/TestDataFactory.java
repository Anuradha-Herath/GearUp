package com.autoserve.util;

import com.autoserve.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class TestDataFactory {

    public Customer createTestCustomer() {
        Customer customer = new Customer();
        customer.setName("Test Customer");
        customer.setEmail("test@example.com");
        return customer;
    }
}