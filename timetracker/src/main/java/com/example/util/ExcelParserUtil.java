package com.example.util;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ExcelParserUtil<TimeEntry> {

    public List<TimeEntry> parse(MultipartFile file) {
        return null;
        // Apache POI logic here
    }
}
  