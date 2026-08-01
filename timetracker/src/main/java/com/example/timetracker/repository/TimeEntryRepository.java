package com.example.timetracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.timetracker.entity.TimeEntry;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
   // it is used to talk to the database without writing SQL or JDBC code


    Optional<TimeEntry> findByWorkDate(LocalDate workDate);
    List<TimeEntry> findByWorkDateBetween(LocalDate start, LocalDate end);


    
// this is JPQL 
@Query("""
SELECT t FROM TimeEntry t
WHERE YEAR(t.workDate) = :year
AND MONTH(t.workDate) = :month
""")
List<TimeEntry> findByYearAndMonth(int year, int month);

}
