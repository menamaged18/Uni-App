package com.unisystem.university.courses.DTOS;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.unisystem.university.courses.Course;
import com.unisystem.university.lectureTime.DTOS.LectureTimeResponse;

import lombok.Data;

@Data
public class CourseResponse {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate courseStartRegistirationDate;
    private LocalDate courseEndRegistirationDate;
    private Long LecturerID;
    private String LecturerName;
    private List<String> prerequisiteCoursesNames = new ArrayList<>();
    private List<LectureTimeResponse> lecturesTime = new ArrayList<>();


    public CourseResponse(Course course){
        this.id = course.getId();
        this.name = course.getName();
        this.startDate = course.getStartDate();
        this.endDate = course.getEndDate();
        this.courseStartRegistirationDate = course.getCourseStartRegistirationDate();
        this.courseEndRegistirationDate = course.getCourseEndRegistirationDate();
        this.LecturerID = course.getLecturer().getId();
        this.LecturerName = course.getLecturer().getName();
        if (course.getPrerequisites() != null) {
            this.prerequisiteCoursesNames = course.getPrerequisites().stream().map(prereq -> prereq.getName())
                .collect(Collectors.toList());            
        }
        if (course.getLecturesTime() != null) {
            this.lecturesTime = course.getLecturesTime().stream().map(LectureTimeResponse::new)
                .collect(Collectors.toList());       
        }
    }
}
