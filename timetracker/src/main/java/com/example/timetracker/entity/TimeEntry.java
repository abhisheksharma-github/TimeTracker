package com.example.timetracker.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "time_entries")
@Data
public class TimeEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate workDate;
    private LocalTime inTime;
    private LocalTime outTime;

    private BigDecimal requiredHours;

    // Store minutes (correct design)
    private long workedMinutes;
    private long shortMinutes;
    private long surplusMinutes;
}
