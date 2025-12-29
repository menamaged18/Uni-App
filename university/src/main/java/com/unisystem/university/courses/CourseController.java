package com.unisystem.university.courses;

import com.unisystem.university.courses.DTOS.CourseCreationReq;
import com.unisystem.university.courses.DTOS.CourseResponse;
import com.unisystem.university.courses.DTOS.CourseUpdateReq;
import com.unisystem.university.users.User;
import com.unisystem.university.users.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private UserService userService; 

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses().stream().map(CourseResponse::new)
            .collect(Collectors.toList()));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long courseId) {
        return ResponseEntity.ok(new CourseResponse(courseService.getCourseById(courseId)));
    }

    @GetMapping("/by-lecturer/{lecturerId}")
    public ResponseEntity<List<CourseResponse>> getLecturerCourses(@PathVariable Long lecturerId) {
        User lecturer = userService.getLecturer(lecturerId); 
        return ResponseEntity.ok(courseService.getLecturerCourses(lecturer).stream().map(CourseResponse::new)
        .collect(Collectors.toList()));
    }

    @GetMapping("/{courseId}/prerequisites")
    public ResponseEntity<Set<CourseResponse>> getCoursePrerequisites(@PathVariable Long courseId) {
        return ResponseEntity.ok(courseService.getCoursePrerequisite(courseId).stream().map(CourseResponse::new)
            .collect(Collectors.toSet()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<CourseResponse> createCourse(@RequestBody CourseCreationReq createDTO) {
        User lecturer = userService.getUserByid(createDTO.getLecturerId());

        Course newCourse = courseService.createCourse(
            createDTO.getName(),
            createDTO.getStartDate(),
            createDTO.getEndDate(),
            createDTO.getCourseStartRegistirationDate(),
            createDTO.getCourseEndRegistirationDate(),
            lecturer,
            createDTO.getIsActive()
        );
        return new ResponseEntity<>(new CourseResponse(newCourse), HttpStatus.CREATED);
    }

    @PostMapping("/create/withPrerequisites")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<CourseResponse> createCourseWithPrerequisites(@RequestBody CourseCreationReq createDTO) {
        User lecturer = userService.getUserByid(createDTO.getLecturerId());
        Set<Course> requiredCourses = createDTO.getPrerequisiteCoursesIds().stream().map(id -> 
            courseService.getCourseById(id)).collect(Collectors.toSet());

        Course newCourse = courseService.createCourse(
            createDTO.getName(),
            createDTO.getStartDate(),
            createDTO.getEndDate(),
            createDTO.getCourseStartRegistirationDate(),
            createDTO.getCourseEndRegistirationDate(),
            lecturer,
            createDTO.getIsActive(),
            requiredCourses
        );
        return new ResponseEntity<>(new CourseResponse(newCourse), HttpStatus.CREATED);
    }

    @PostMapping("/{courseId}/prerequisites")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<CourseResponse> addPrerequisite(@PathVariable Long courseId, @RequestBody Long prerequisiteCourseId) {
        Course updatedCourse = courseService.addPrerequisite(courseId, prerequisiteCourseId);
        return ResponseEntity.ok(new CourseResponse(updatedCourse));
    }

    @PatchMapping("/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<CourseResponse> editCourse(@PathVariable Long courseId, @RequestBody CourseUpdateReq updateDTO) {
        User lecturer = null;
        if (updateDTO.getLecturerId() != null) {
            lecturer = userService.getUserByid(updateDTO.getLecturerId());
        }

        Course updatedCourse = courseService.editCourse(
                courseId,
                updateDTO.getName(),
                updateDTO.getStartDate(),
                updateDTO.getEndDate(),
                updateDTO.getCourseStartRegistirationDate(),
                updateDTO.getCourseEndRegistirationDate(),
                lecturer,
                updateDTO.getIsActive()
        );
        return ResponseEntity.ok(new CourseResponse(updatedCourse));
    }

    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long courseId) {
        courseService.deleteCourseById(courseId);
        return ResponseEntity.noContent().build();
    }
}
