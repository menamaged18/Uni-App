package com.unisystem.university.enrollment.DTOS;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EnrollmentRequest {
    private Long studentId;
    private Long courseId;
    private Integer semester;
}