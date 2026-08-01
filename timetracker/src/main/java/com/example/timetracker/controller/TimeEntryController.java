package com.example.timetracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.timetracker.dto.MonthlySummaryDTO;
import com.example.timetracker.dto.TimeEntryRequestDTO;
import com.example.timetracker.dto.TimeEntryResponseDTO;
import com.example.timetracker.service.TimeEntryService;

@RestController
@RequestMapping("/api/time-entries") // base url -> here we see the data 
@CrossOrigin(origins = "http://localhost:5173") // frontend of this project
public class TimeEntryController {

    private final TimeEntryService service; // here we are accessing the Service File, final is used for used only once , can't change in it 

    public TimeEntryController(TimeEntryService service) { // here Service are been accesses without writting there logic here
        this.service = service; /*Take the service object given by Spring
                                  and store it inside this controller*/
    }

    // ---------------- CREATE ----------------
    @PostMapping 
    public TimeEntryResponseDTO create(
            @RequestBody TimeEntryRequestDTO dto) { // here we used Request_Body to convert json into java obj
        return (TimeEntryResponseDTO) service.createEntry(dto);
    }

    // ---------------- READ ALL ----------------
    @GetMapping
    public List<TimeEntryResponseDTO> getAll() {
        return service.getAllEntries();
    }

    // ---------------- MONTHLY SUMMARY ----------------
    @GetMapping("/monthly-summary")
    public MonthlySummaryDTO getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month) {

        return service.getMonthlySummary(year, month);
    }
}
