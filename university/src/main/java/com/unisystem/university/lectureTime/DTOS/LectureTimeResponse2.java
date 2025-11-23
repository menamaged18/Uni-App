package com.unisystem.university.lectureTime.DTOS;

import java.time.LocalTime;

import com.unisystem.university.lectureTime.Day;
import com.unisystem.university.lectureTime.LectureTime;

import lombok.Data;

@Data
public class LectureTimeResponse2 {
    private Long id;
    private Day day;
    private LocalTime time;
    private Long courseId;
    private String courseName;

    public LectureTimeResponse2(LectureTime lecTime){
        this.id = lecTime.getId();
        this.day = lecTime.getDay();
        this.time = lecTime.getTime();
        this.courseId = lecTime.getCourse().getId();
        this.courseName = lecTime.getCourse().getName();
    }  
}
