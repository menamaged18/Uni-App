package com.unisystem.university.enrollment.DTOS;

import java.time.LocalDate;

import com.unisystem.university.enrollment.Enrollment;
import com.unisystem.university.enrollment.Types.CourseStatus;
import com.unisystem.university.enrollment.Types.Grade;

import lombok.Data;

@Data
public class EnrollmentResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseName;
    private LocalDate enrollmentDate = LocalDate.now();
    private Grade grade;
    private Integer semester;
    private CourseStatus status; // "In Progress," "Completed," or "Dropped."

    public EnrollmentResponse(Enrollment enroll){
        this.id = enroll.getId();
        this.studentId = enroll.getStudent().getId();
        this.studentName = enroll.getStudent().getName();
        this.courseId = enroll.getCourse().getId();
        this.courseName = enroll.getCourse().getName();
        this.enrollmentDate = enroll.getEnrollmentDate();
        this.grade = enroll.getGrade();
        this.semester = enroll.getSemester();
        this.status = enroll.getStatus();
    }
}
