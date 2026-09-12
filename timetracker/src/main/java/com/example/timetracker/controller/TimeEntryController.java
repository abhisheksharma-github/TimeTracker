package com.example.timetracker.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.timetracker.dto.MonthlySummaryDTO;
import com.example.timetracker.dto.TimeEntryRequestDTO;
import com.example.timetracker.dto.TimeEntryResponseDTO;
import com.example.timetracker.service.TimeEntryService;

@RestController
@RequestMapping("/api/time-entries")
@CrossOrigin(origins = "*") // Allows local dev and deployed Vercel frontend
public class TimeEntryController {

    private final TimeEntryService service;

    public TimeEntryController(TimeEntryService service) {
        this.service = service;
    }

    // ---------------- CREATE ----------------
    @PostMapping
    public ResponseEntity<TimeEntryResponseDTO> create(@RequestBody TimeEntryRequestDTO dto) {
        TimeEntryResponseDTO response = service.createEntry(dto);
        return ResponseEntity.ok(response);
    }

    // ---------------- READ ALL ----------------
    @GetMapping
    public ResponseEntity<List<TimeEntryResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAllEntries());
    }

    // ---------------- UPDATE ----------------
    @PutMapping("/{id}")
    public ResponseEntity<TimeEntryResponseDTO> update(
            @PathVariable Long id,
            @RequestBody TimeEntryRequestDTO dto) {
        return ResponseEntity.ok(service.updateEntry(id, dto));
    }

    // ---------------- DELETE ----------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }

    // ---------------- MONTHLY SUMMARY ----------------
    @GetMapping("/monthly-summary")
    public ResponseEntity<MonthlySummaryDTO> getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(service.getMonthlySummary(year, month));
    }
}
