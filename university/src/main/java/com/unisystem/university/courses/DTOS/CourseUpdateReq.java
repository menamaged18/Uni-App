package com.unisystem.university.courses.DTOS;

import java.time.LocalDate;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CourseUpdateReq {
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate courseStartRegistirationDate;
    private LocalDate courseEndRegistirationDate;
    private Long lecturerId;
    private Boolean isActive;

}
