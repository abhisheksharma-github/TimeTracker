package com.example.timetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeEntryResponseDTO {

    private Long id;
    private LocalDate workDate;
    private LocalTime inTime;
    private LocalTime outTime;

    private BigDecimal workedHours;
    private BigDecimal shortHours;
    private BigDecimal surplusHours;

    private String remarks;
    private LocalDateTime createdAt;
}
