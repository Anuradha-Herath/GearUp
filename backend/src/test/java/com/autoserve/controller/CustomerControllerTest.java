package com.autoserve.controller;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CustomerController.class)
public class CustomerControllerTest {

    private MockMvc mockMvc;

    @Test
    public void testGetCustomer() throws Exception {
        // Add test logic
    }
}