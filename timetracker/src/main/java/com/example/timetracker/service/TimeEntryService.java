package com.example.timetracker.service;

import java.util.List;

import com.example.timetracker.dto.MonthlySummaryDTO;
import com.example.timetracker.dto.TimeEntryRequestDTO;
import com.example.timetracker.dto.TimeEntryResponseDTO;

public interface TimeEntryService {
   // here all functions are been decalared 


    TimeEntryResponseDTO createEntry(TimeEntryRequestDTO dto); 

    List<TimeEntryResponseDTO> getAllEntries();

    MonthlySummaryDTO getMonthlySummary(int year, int month);

    TimeEntryResponseDTO updateEntry(Long id, TimeEntryRequestDTO dto);

    void deleteEntry(Long id);
}

