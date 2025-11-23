package com.unisystem.university.enrollment;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unisystem.university.courses.Course;
import com.unisystem.university.courses.CourseService;
import com.unisystem.university.enrollment.DTOS.EnrollmentChangeGradeReq;
import com.unisystem.university.enrollment.DTOS.EnrollmentChangeStatusReq;
import com.unisystem.university.enrollment.DTOS.EnrollmentEditRequest;
import com.unisystem.university.enrollment.DTOS.EnrollmentRequest;
import com.unisystem.university.enrollment.DTOS.EnrollmentResponse;
import com.unisystem.university.enrollment.DTOS.GradeChangeReq;
import com.unisystem.university.enrollment.DTOS.StatusChangeReq;
import com.unisystem.university.enrollment.DTOS.StudentEnrollmentsResponse;
import com.unisystem.university.users.User;
import com.unisystem.university.users.UserService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;
    private final UserService userService;
    private final CourseService courseService;

    public EnrollmentController(EnrollmentService enrollmentService, UserService userService,
                        CourseService courseService) {
        this.enrollmentService = enrollmentService;
        this.userService = userService;
        this.courseService = courseService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentEnrollmentsResponse>> getStudentEnrollments(@PathVariable Long studentId) {
        User student = userService.getStudent(studentId);
        
        List<Enrollment> enrollments = enrollmentService.getStudentEnrollments(student);
        return ResponseEntity.ok(enrollments.stream().map(StudentEnrollmentsResponse::new).collect(Collectors.toList()));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<List<EnrollmentResponse>> getCourseEnrollments(@PathVariable Long courseId) {
        Course course = courseService.getCourseById(courseId);
        
        List<Enrollment> enrollments = enrollmentService.getCourseEnrollments(course);
        return ResponseEntity.ok(enrollments.stream().map(EnrollmentResponse::new).collect(Collectors.toList()));
    }

    @GetMapping("/{enrollmentId}")
    public ResponseEntity<EnrollmentResponse> getEnrollmentById(@PathVariable Long enrollmentId) {
        try {
            Enrollment enrollment = enrollmentService.getEnrollmentById(enrollmentId);
            return ResponseEntity.ok(new EnrollmentResponse(enrollment));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{enrollmentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long enrollmentId) {
        enrollmentService.deleteEntrollmentById(enrollmentId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/statusChangeEnrollmentStatusByStudentAndCourseId")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> changeEnrollmentStatusByStudentAndCourseId(@RequestBody EnrollmentChangeStatusReq req) {
        User student = userService.getStudent(req.getStudentId());
        
        Course course = courseService.getCourseById(req.getCourseId());
        
        enrollmentService.changeEnrollmentStatus(student, course, req.getStatus());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> changeEnrollmentStatus(@RequestBody StatusChangeReq req) {
        enrollmentService.setStatus(req.getEnrollId(), req.getStatus());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/gradeByStudentAndCourseId")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<Void> setGradeByStudentAndCourseId(@RequestBody EnrollmentChangeGradeReq req) {
        User student = userService.getStudent(req.getStudentId());
        
        Course course = courseService.getCourseById(req.getCourseId());
        
        enrollmentService.setGrade(student, course, req.getGrade());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/grade")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<Void> setGrade(@RequestBody GradeChangeReq req) {
        enrollmentService.setGrade(req.getEnrollId(), req.getGrade());
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponse> createEnrollment(@RequestBody EnrollmentRequest request) {
        User student = userService.getStudent(request.getStudentId());
        
        Course course = courseService.getCourseById(request.getCourseId());
        
        Enrollment enrollment = enrollmentService.makeEnrollment(student, course, request.getSemester());
        return ResponseEntity.status(HttpStatus.CREATED).body(new EnrollmentResponse(enrollment));
    }

    @PostMapping("/after-due")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<EnrollmentResponse> createEnrollmentAfterDueDate(@RequestBody EnrollmentRequest request) {
        User student = userService.getStudent(request.getStudentId());
        
        Course course = courseService.getCourseById(request.getCourseId());
        
        Enrollment enrollment = enrollmentService.makeEnrollmentAfterDueDate(student, course, request.getSemester());
        return ResponseEntity.status(HttpStatus.CREATED).body(new EnrollmentResponse(enrollment));
    }

    @PutMapping("/{enrollmentId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<EnrollmentResponse> editEnrollment(
            @PathVariable Long enrollmentId,
            @RequestBody EnrollmentEditRequest request) {
        try {
            User student = userService.getUserByid(request.getStudentId());
            
            Course course = courseService.getCourseById(request.getCourseId());
            
            Enrollment enrollment = enrollmentService.editEnrollment(
                enrollmentId, student, course, request.getSemester(), 
                request.getStatus(), request.getGrade()
            );
            return ResponseEntity.ok(new EnrollmentResponse(enrollment));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{courseId}/count")
    public Long getEnrolledStudentCount(@PathVariable Long courseId) {
        Course course = courseService.getCourseById(courseId);

        return enrollmentService.cousreEnrollments(course);
    }

}
