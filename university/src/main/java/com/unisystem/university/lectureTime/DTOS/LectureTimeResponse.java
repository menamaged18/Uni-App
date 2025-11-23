package com.unisystem.university.lectureTime.DTOS;

import java.time.LocalTime;

import com.unisystem.university.lectureTime.Day;
import com.unisystem.university.lectureTime.LectureTime;

import lombok.Data;

@Data
public class LectureTimeResponse {
    private Long id;
    private Day day;
    private LocalTime time;

    public LectureTimeResponse(LectureTime lecTime){
        this.id = lecTime.getId();
        this.day = lecTime.getDay();
        this.time = lecTime.getTime();
    }
}
