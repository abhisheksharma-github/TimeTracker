package com.example.timetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.Data;

@Data
public class TimeEntryRequestDTO {

    private LocalDate workDate;
    private LocalTime inTime;
    private LocalTime outTime;
    private BigDecimal requiredHours;
    private String remarks;

    // Captured directly from the user's client device
    private LocalDateTime createdAt;
}
