package com.unisystem.university.lectureTime.DTOS;

import java.time.LocalTime;

import com.unisystem.university.lectureTime.Day;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LectureTimeRequest {
    private Long courseId;
    private Day day;
    private LocalTime time;
}
