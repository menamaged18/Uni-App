package com.unisystem.university.enrollment.DTOS;

import com.unisystem.university.enrollment.Types.CourseStatus;
import com.unisystem.university.enrollment.Types.Grade;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EnrollmentEditRequest {
    private Long studentId;
    private Long courseId;
    private Integer semester;
    private CourseStatus status;
    private Grade grade;
}
