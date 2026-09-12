package com.example.timetracker.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.timetracker.dto.MonthlySummaryDTO;
import com.example.timetracker.dto.TimeEntryRequestDTO;
import com.example.timetracker.dto.TimeEntryResponseDTO;
import com.example.timetracker.entity.TimeEntry;
import com.example.timetracker.repository.TimeEntryRepository;
import com.example.timetracker.service.TimeEntryService;

@Service
public class TimeEntryServiceImpl implements TimeEntryService {

    private final TimeEntryRepository repository;

    public TimeEntryServiceImpl(TimeEntryRepository repository) {
        this.repository = repository;
    }

    @Override
    public TimeEntryResponseDTO createEntry(TimeEntryRequestDTO dto) {
        TimeEntry entry = new TimeEntry();
        entry.setWorkDate(dto.getWorkDate());
        entry.setInTime(dto.getInTime());
        entry.setOutTime(dto.getOutTime());
        entry.setRequiredHours(dto.getRequiredHours() != null ? dto.getRequiredHours() : BigDecimal.valueOf(8.67));
        entry.setRemarks(dto.getRemarks());

        // Set device timestamp if provided by client, otherwise current timestamp
        if (dto.getCreatedAt() != null) {
            entry.setCreatedAt(dto.getCreatedAt());
        } else {
            entry.setCreatedAt(LocalDateTime.now());
        }

        calculateHours(entry);
        TimeEntry saved = repository.save(entry);

        return mapToResponse(saved);
    }

    @Override
    public List<TimeEntryResponseDTO> getAllEntries() {
        return repository.findAll()
                .stream()
                .sorted((a, b) -> {
                    if (a.getWorkDate() == null || b.getWorkDate() == null) return 0;
                    int dateComp = b.getWorkDate().compareTo(a.getWorkDate());
                    if (dateComp != 0) return dateComp;
                    if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
                        return b.getCreatedAt().compareTo(a.getCreatedAt());
                    }
                    return 0;
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TimeEntryResponseDTO updateEntry(Long id, TimeEntryRequestDTO dto) {
        TimeEntry entry = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Time entry not found with id: " + id));

        entry.setWorkDate(dto.getWorkDate());
        entry.setInTime(dto.getInTime());
        entry.setOutTime(dto.getOutTime());
        if (dto.getRequiredHours() != null) {
            entry.setRequiredHours(dto.getRequiredHours());
        }
        entry.setRemarks(dto.getRemarks());

        calculateHours(entry);
        TimeEntry updated = repository.save(entry);

        return mapToResponse(updated);
    }

    @Override
    public void deleteEntry(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        }
    }

    @Override
    public MonthlySummaryDTO getMonthlySummary(int year, int month) {
        List<TimeEntry> allEntries = repository.findAll();

        long totalWorkedMinutes = 0;
        long totalShortMinutes = 0;
        long totalSurplusMinutes = 0;

        for (TimeEntry entry : allEntries) {
            if (entry.getWorkDate() != null &&
                entry.getWorkDate().getYear() == year &&
                entry.getWorkDate().getMonthValue() == month) {

                totalWorkedMinutes += entry.getWorkedMinutes();
                totalShortMinutes += entry.getShortMinutes();
                totalSurplusMinutes += entry.getSurplusMinutes();
            }
        }

        MonthlySummaryDTO summary = new MonthlySummaryDTO();
        summary.setTotalWorkedMinutes(totalWorkedMinutes);
        summary.setTotalShortMinutes(totalShortMinutes);
        summary.setTotalSurplusMinutes(totalSurplusMinutes);

        summary.setTotalWorkedHours(minutesToHours(totalWorkedMinutes));
        summary.setTotalShortHours(minutesToHours(totalShortMinutes));
        summary.setTotalSurplusHours(minutesToHours(totalSurplusMinutes));

        return summary;
    }

    // BUSINESS LOGIC
    private void calculateHours(TimeEntry entry) {
        if (entry.getInTime() == null || entry.getOutTime() == null) {
            entry.setWorkedMinutes(0);
            entry.setShortMinutes(0);
            entry.setSurplusMinutes(0);
            return;
        }

        long workedMinutes = Duration.between(entry.getInTime(), entry.getOutTime()).toMinutes();
        if (workedMinutes < 0) {
            workedMinutes = 0;
        }
        entry.setWorkedMinutes(workedMinutes);

        BigDecimal reqHours = entry.getRequiredHours() != null ? entry.getRequiredHours() : BigDecimal.valueOf(8.67);
        long requiredMinutes = reqHours.multiply(BigDecimal.valueOf(60)).longValue();

        if (workedMinutes < requiredMinutes) {
            entry.setShortMinutes(requiredMinutes - workedMinutes);
            entry.setSurplusMinutes(0);
        } else {
            entry.setSurplusMinutes(workedMinutes - requiredMinutes);
            entry.setShortMinutes(0);
        }
    }

    // MAPPER
    private TimeEntryResponseDTO mapToResponse(TimeEntry entry) {
        TimeEntryResponseDTO dto = new TimeEntryResponseDTO();
        dto.setId(entry.getId());
        dto.setWorkDate(entry.getWorkDate());
        dto.setInTime(entry.getInTime());
        dto.setOutTime(entry.getOutTime());

        dto.setWorkedHours(minutesToHours(entry.getWorkedMinutes()));
        dto.setShortHours(minutesToHours(entry.getShortMinutes()));
        dto.setSurplusHours(minutesToHours(entry.getSurplusMinutes()));

        dto.setRemarks(entry.getRemarks());
        dto.setCreatedAt(entry.getCreatedAt());

        return dto;
    }

    private BigDecimal minutesToHours(long minutes) {
        return BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
    }
}
