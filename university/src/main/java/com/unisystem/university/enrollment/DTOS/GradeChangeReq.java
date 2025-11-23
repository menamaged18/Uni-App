package com.unisystem.university.enrollment.DTOS;

import com.unisystem.university.enrollment.Types.Grade;

import lombok.Data;

@Data
public class GradeChangeReq {
    private Long enrollId;
    private Grade grade;
}
