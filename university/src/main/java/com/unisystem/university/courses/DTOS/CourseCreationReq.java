package com.unisystem.university.courses.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseCreationReq {
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate courseStartRegistirationDate;
    private LocalDate courseEndRegistirationDate;
    private Long lecturerId;
    private Set<Long> prerequisiteCoursesIds; 
    private Boolean isActive;
}
