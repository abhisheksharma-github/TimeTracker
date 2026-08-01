package com.example.timetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter

public class TimeEntryResponseDTO {

    private LocalDate workDate;
    private LocalTime inTime;
    private LocalTime outTime;

    private BigDecimal workedHours;
    private BigDecimal shortHours;
    private BigDecimal surplusHours;

    // // getters & setters
    // public LocalDate getWorkDate() { return workDate; }
    // public void setWorkDate(LocalDate workDate) { this.workDate = workDate; }

    // public LocalTime getInTime() { return inTime; }
    // public void setInTime(LocalTime inTime) { this.inTime = inTime; }

    // public LocalTime getOutTime() { return outTime; }
    // public void setOutTime(LocalTime outTime) { this.outTime = outTime; }

    // public BigDecimal getWorkedHours() { return workedHours; }
    // public void setWorkedHours(BigDecimal workedHours) { this.workedHours = workedHours; }

    // public BigDecimal getShortHours() { return shortHours; }
    // public void setShortHours(BigDecimal shortHours) { this.shortHours = shortHours; }

    // public BigDecimal getSurplusHours() { return surplusHours; }
    // public void setSurplusHours(BigDecimal surplusHours) { this.surplusHours = surplusHours; }
}
