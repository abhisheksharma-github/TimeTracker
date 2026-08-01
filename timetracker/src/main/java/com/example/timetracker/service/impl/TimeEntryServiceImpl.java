package com.example.timetracker.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
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

    private final TimeEntryRepository repository; // here accessing the file => repsoitory 

    public TimeEntryServiceImpl(TimeEntryRepository repository) {
        this.repository = repository;
    }

    @Override
    public TimeEntryResponseDTO createEntry(TimeEntryRequestDTO dto) {

        TimeEntry entry = new TimeEntry();
        entry.setWorkDate(dto.getWorkDate());
        entry.setInTime(dto.getInTime());
        entry.setOutTime(dto.getOutTime());
        entry.setRequiredHours(dto.getRequiredHours());

        calculateHours(entry);
        repository.save(entry);

        return mapToResponse(entry);
    }

    @Override
    public List<TimeEntryResponseDTO> getAllEntries() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // BUSINESS LOGIC
    private void calculateHours(TimeEntry entry) {

        long workedMinutes =
                Duration.between(entry.getInTime(), entry.getOutTime()).toMinutes();

        entry.setWorkedMinutes(workedMinutes);

        long requiredMinutes =
                entry.getRequiredHours().multiply(BigDecimal.valueOf(60)).longValue();

        if (workedMinutes < requiredMinutes) {
            entry.setShortMinutes(requiredMinutes - workedMinutes);
            entry.setSurplusMinutes(0);
        } else {
            entry.setSurplusMinutes(workedMinutes - requiredMinutes);
            entry.setShortMinutes(0);
        }
    }
                                                                    
    // FIXED MAPPER 
    private TimeEntryResponseDTO mapToResponse(TimeEntry entry) {

        TimeEntryResponseDTO dto = new TimeEntryResponseDTO();

        dto.setWorkDate(entry.getWorkDate());
        dto.setInTime(entry.getInTime());
        dto.setOutTime(entry.getOutTime());

        dto.setWorkedHours(minutesToHours(entry.getWorkedMinutes()));
        dto.setShortHours(minutesToHours(entry.getShortMinutes()));
        dto.setSurplusHours(minutesToHours(entry.getSurplusMinutes()));

        return dto;
    }

    private BigDecimal minutesToHours(long minutes) {
        return BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
    }

    @Override
    public MonthlySummaryDTO getMonthlySummary(int year, int month) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public TimeEntryResponseDTO updateEntry(Long id, TimeEntryRequestDTO dto) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void deleteEntry(Long id) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
