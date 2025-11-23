package com.unisystem.university.lectureTime;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unisystem.university.courses.Course;
import com.unisystem.university.courses.CourseService;
import com.unisystem.university.lectureTime.DTOS.LectureTimeRequest;
import com.unisystem.university.lectureTime.DTOS.LectureTimeResponse;
import com.unisystem.university.lectureTime.DTOS.LectureTimeResponse2;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/lecture-times")
public class LectureTimeController {
    private final LectureTimeService lectureTimeService;
    private final CourseService courseService;

    public LectureTimeController(LectureTimeService lectureTimeService, CourseService courseService) {
        this.lectureTimeService = lectureTimeService;
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<LectureTimeResponse2>> getAllLectureTimes() {
        try {
            List<LectureTime> lectureTimes = lectureTimeService.getAllLecturesTime();
            return ResponseEntity.ok(lectureTimes.stream().map(LectureTimeResponse2::new).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // LectureTimeResponse2 not LectureTimeResponse because i already know course id
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LectureTimeResponse>> getCourseLectureTimes(@PathVariable Long courseId) {
        try {
            Course course = courseService.getCourseById(courseId);
            List<LectureTime> lectureTimes = lectureTimeService.getCourseLectureTimes(course);
            return ResponseEntity.ok(lectureTimes.stream().map(LectureTimeResponse::new).collect(Collectors.toList()));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/day/{day}")
    public ResponseEntity<List<LectureTimeResponse2>> getDayLectureTimes(@PathVariable String day) {
        try {
            List<LectureTime> lectureTimes = lectureTimeService.getDayLectureTimes(day);
            return ResponseEntity.ok(lectureTimes.stream().map(LectureTimeResponse2::new).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{lectureTimeId}")
    public ResponseEntity<LectureTimeResponse2> getLectureTimeById(@PathVariable Long lectureTimeId) {
        try {
            LectureTime lectureTime = lectureTimeService.getLectureTimeById(lectureTimeId);
            return ResponseEntity.ok(new LectureTimeResponse2(lectureTime));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<LectureTimeResponse> addLectureTime(@RequestBody LectureTimeRequest request) {
        try {
            Course course = courseService.getCourseById(request.getCourseId());
            LectureTime lectureTime = lectureTimeService.addLectureTime(
                course, request.getDay(), request.getTime()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(new LectureTimeResponse(lectureTime));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{lectureTimeId}")
    public ResponseEntity<Void> deleteLectureTime(@PathVariable Long lectureTimeId) {
        try {
            lectureTimeService.deleteLectureTimeById(lectureTimeId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}