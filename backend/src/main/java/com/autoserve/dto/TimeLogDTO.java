package com.autoserve.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TimeLogDTO {
    private Long id;
    private Long employeeId;
    private Long projectId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String description;
}