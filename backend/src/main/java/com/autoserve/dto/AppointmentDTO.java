package com.autoserve.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long id;
    private LocalDateTime dateTime;
    private String status;
    // Add other fields as needed
}