package com.unisystem.university.enrollment.DTOS;

import com.unisystem.university.enrollment.Types.CourseStatus;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EnrollmentChangeStatusReq {
    private Long studentId;
    private Long courseId;
    private CourseStatus status;
}
