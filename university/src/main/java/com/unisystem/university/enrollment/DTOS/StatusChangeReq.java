package com.unisystem.university.enrollment.DTOS;

import com.unisystem.university.enrollment.Types.CourseStatus;

import lombok.Data;

@Data
public class StatusChangeReq {
    private Long enrollId;
    private CourseStatus status; 
}
