package com.example.timetracker.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class MonthlySummaryDTO {

    private long totalWorkedMinutes = 0;
    private long totalShortMinutes = 0;
    private long totalSurplusMinutes = 0;

    private BigDecimal totalWorkedHours = BigDecimal.ZERO;
    private BigDecimal totalShortHours = BigDecimal.ZERO;
    private BigDecimal totalSurplusHours = BigDecimal.ZERO;
}
