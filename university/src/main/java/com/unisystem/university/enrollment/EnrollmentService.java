package com.unisystem.university.enrollment;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.unisystem.university.courses.Course;
import com.unisystem.university.enrollment.Types.CourseStatus;
import com.unisystem.university.enrollment.Types.Grade;
import com.unisystem.university.lectureTime.LectureTime;
import com.unisystem.university.users.User;

import jakarta.persistence.EntityNotFoundException;

@Service
public class EnrollmentService {
    private EnrollmentRepository enrollmentRepo;

    public EnrollmentService(EnrollmentRepository _EnrollmentRepository){
        this.enrollmentRepo = _EnrollmentRepository;
    }

    // helper function used to check before adding new enroll
    public void isValidEnroll(User student, Course course){
        // check if the Course lectures time confilcts with another course lectures time
        List<Enrollment> studentEnrollments = getStudentEnrollments(student);
        // course prerequisites
        Set<Course> coursePrerequisites = course.getPrerequisites();
        Set<Course> matchedCourses = new HashSet<>();
        for(Enrollment studentEnroll : studentEnrollments){
            // helper check for course prerequisites
            if (coursePrerequisites.contains(studentEnroll.getCourse())) {
                matchedCourses.add(studentEnroll.getCourse());
            }  
            
            // if the course is completed skip 
            if (studentEnroll.getStatus() == CourseStatus.Completed || studentEnroll.getStatus() == CourseStatus.Dropped) {
                continue;
            } 
            // check if the two courses in the same period or not before checking lecture time conflict
            // because if the two courses not in the same period there will be no problem to register it 
            // this is an extra check because if any unkonwn error happens in course Enrollment status
            boolean overlaps = studentEnroll.getCourse().getStartDate().isBefore(course.getEndDate()) && 
                            studentEnroll.getCourse().getEndDate().isAfter(course.getStartDate());
            // check lectures time conflict for two courses in the same period 
            if (overlaps) {
                for (LectureTime lecTime : studentEnroll.getCourse().getLecturesTime()) {
                    for(LectureTime courseLecTime: course.getLecturesTime()){
                        if (lecTime.getDay() == courseLecTime.getDay() && lecTime.getTime() == courseLecTime.getTime()) {
                            throw new RuntimeException("Can not Register two Courses at the same time. " +
                                "course 1: " + course.getName() +
                                " course 2: " + studentEnroll.getCourse().getName() + 
                                " at time: " + courseLecTime.getTime() 
                            );                        
                        }
                    }
                }                
            } 
        }

        // check if the student finished all prerequisites
        if (matchedCourses.size() != coursePrerequisites.size()) {
            Set<Course> nonMatchedCourses = new HashSet<>();
            for(Course prereq: coursePrerequisites){
                if (!matchedCourses.contains(prereq)) {
                    nonMatchedCourses.add(prereq);
                }
            }

            String missingPrerequisites = nonMatchedCourses.stream()
                .map(Course::getName) 
                .collect(Collectors.joining(", ")); 
                throw new RuntimeException("Can not register for this course " +  
                    "because the following prerequisites are not finished: " + missingPrerequisites);             
        }

    }

    public List<Enrollment> getStudentEnrollments(User student){
        return enrollmentRepo.findByStudent(student);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('LECTURER')")
    public List<Enrollment> getCourseEnrollments(Course course){
        return enrollmentRepo.findByCourse(course);
    }

    public Enrollment getEnrollmentById(Long enrollmentId) throws EntityNotFoundException{
        return enrollmentRepo.findById(enrollmentId).orElseThrow(() 
            -> new EntityNotFoundException("Enrollment with id: " + enrollmentId + "not found"));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public void deleteEntrollmentById(Long entrollmentId){
        enrollmentRepo.deleteById(entrollmentId);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public void changeEnrollmentStatus(User student, Course course, CourseStatus status) throws EntityNotFoundException {
        Optional<Enrollment> OptEnroll = enrollmentRepo.findByStudentAndCourse(student, course);
        if (OptEnroll.isPresent()) {
            Enrollment enroll = OptEnroll.get();
            enroll.setStatus(status);
            enrollmentRepo.save(enroll);
        }else{
            throw new EntityNotFoundException("can not find Enrollment with student id: " 
                + student.getId() + " and course id: " + course.getId());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('LECTURER')")
    public void setStatus(Long enrollId, CourseStatus status){
        Enrollment enroll = getEnrollmentById(enrollId);
        
        enroll.setStatus(status);
        enrollmentRepo.save(enroll);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('LECTURER')")
    public void setGrade(User student, Course course, Grade grade){
        Optional<Enrollment> OptEnroll = enrollmentRepo.findByStudentAndCourse(student, course);
        if (OptEnroll.isPresent()) {
            Enrollment enroll = OptEnroll.get();
            enroll.setGrade(grade);
            enroll.setStatus(CourseStatus.Completed);
            enrollmentRepo.save(enroll);
        }else{
            throw new EntityNotFoundException("can not find Enrollment with student id: " 
                + student.getId() + " and course id: " + course.getId());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('LECTURER')")
    public void setGrade(Long enrollId, Grade grade){
        Enrollment enroll = getEnrollmentById(enrollId);
        
        enroll.setGrade(grade);
        enroll.setStatus(CourseStatus.Completed);
        enrollmentRepo.save(enroll);
    }

    public Enrollment makeEnrollment(User student, Course course, Integer semester){
        // check if the course enrollment date has finished
        if (LocalDate.now().isAfter(course.getCourseEndRegistirationDate())) {
            throw new RuntimeException("Registriation time has ended for the \n" +
                "course: " + course.getName() +
                "Last date to enroll was: " + course.getCourseEndRegistirationDate() 
            );                 
        }

        boolean alreadyEnrolled = enrollmentRepo.existsByStudentAndCourseAndSemester(student, course, semester);
        if (alreadyEnrolled) {
            throw new RuntimeException("Student '" + student.getName() + 
                "' is already enrolled in course '" + course.getName() + 
                "' for semester " + semester);
        }

        isValidEnroll(student, course);
        
        Enrollment enroll = new Enrollment(student, course, semester, CourseStatus.InProgress);
        return enrollmentRepo.save(enroll);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Enrollment makeEnrollmentAfterDueDate(User student, Course course, Integer semester){
        isValidEnroll(student, course);

        boolean alreadyEnrolled = enrollmentRepo.existsByStudentAndCourseAndSemester(student, course, semester);
        if (alreadyEnrolled) {
            throw new RuntimeException("Student '" + student.getName() + 
                "' is already enrolled in course '" + course.getName() + 
                "' for semester " + semester);
        }        
        
        Enrollment enroll = new Enrollment(student, course, semester, CourseStatus.Completed);
        return enrollmentRepo.save(enroll);   
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Enrollment editEnrollment(Long enrollmentId, User student, Course course, Integer semester, 
            CourseStatus status, Grade grade){
        Enrollment enroll = getEnrollmentById(enrollmentId);
        if (student != null) {
            enroll.setStudent(student);
        }
        if (course != null) {
            enroll.setCourse(course);
        }
        if (semester != null) {
            enroll.setSemester(semester);
        }
        if (status != null) {
            enroll.setStatus(status);
        }
        if (grade != null) {
            enroll.setGrade(grade);
        }
        return enrollmentRepo.save(enroll);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('LECTURER')")
    public Long cousreEnrollments(Course course){
        return enrollmentRepo.countByCourse(course);
    }
}
