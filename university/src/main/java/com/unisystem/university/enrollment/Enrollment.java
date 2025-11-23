package com.unisystem.university.enrollment;

import java.time.LocalDate;

import com.unisystem.university.courses.Course;
import com.unisystem.university.enrollment.Types.CourseStatus;
import com.unisystem.university.enrollment.Types.Grade;
import com.unisystem.university.users.User;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private LocalDate enrollmentDate = LocalDate.now();
    @Enumerated(EnumType.STRING)
    private Grade grade;
    private Integer semester;

    @Enumerated(EnumType.STRING)
    private CourseStatus status; 

    public Enrollment(User student, Course course,  
            Integer semester, CourseStatus status){
        this.student = student;
        this.course = course;
        this.semester = semester;
        this.status = status;
    }
}
