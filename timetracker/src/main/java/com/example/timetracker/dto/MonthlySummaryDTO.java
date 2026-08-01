package com.example.timetracker.dto;

import java.math.BigDecimal;

public class MonthlySummaryDTO {

    private BigDecimal totalWorkedHours = BigDecimal.ZERO;
    private BigDecimal totalShortHours = BigDecimal.ZERO;
    private BigDecimal totalSurplusHours = BigDecimal.ZERO;

    public BigDecimal getTotalWorkedHours() {
        return totalWorkedHours;
    }

    public void setTotalWorkedHours(BigDecimal totalWorkedHours) {
        this.totalWorkedHours = totalWorkedHours;
    }

    public BigDecimal getTotalShortHours() {
        return totalShortHours;
    }

    public void setTotalShortHours(BigDecimal totalShortHours) {
        this.totalShortHours = totalShortHours;
    }

    public BigDecimal getTotalSurplusHours() {
        return totalSurplusHours;
    }

    public void setTotalSurplusHours(BigDecimal totalSurplusHours) {
        this.totalSurplusHours = totalSurplusHours;
    }
}
