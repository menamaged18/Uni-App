package com.unisystem.university.courses;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.unisystem.university.users.User;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CourseService {
    private CourseRepository courseRepo;

    public CourseService(CourseRepository _courseRepo){
        this.courseRepo = _courseRepo;
    }

    // helper function to validate course details
    private void courseValidation(User lecturer, String courseName, LocalDate courseStartRegistrationDate, 
        LocalDate courseEndRegistrationDate, LocalDate startDate, LocalDate endDate){
        // Basic Argument Check
        if (lecturer == null || courseName == null || courseName.trim().isEmpty()) {
            throw new IllegalArgumentException("Course name and lecturer cannot be null or empty.");
        }
        
        // Check if course name is unique
        if (courseRepo.findByName(courseName).isPresent()) {
            throw new IllegalArgumentException("Course name already exists");
        }
        
        // Registration Date Order Check
        if (courseStartRegistrationDate.isAfter(courseEndRegistrationDate)) {
            throw new RuntimeException("Course start registration date cannot be after the end registration date.");
        }
        
        // Course Date Order Check
        if (startDate.isAfter(endDate)) {
            throw new RuntimeException("Course start date cannot be after the course end date.");
        }

        // Registration vs Course Start Date Check (Must register before course starts) ---
        if (courseEndRegistrationDate.isAfter(startDate)) {
            throw new RuntimeException("Course registration must end before the course starts.");
        }

    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public Course createCourse(String courseName, LocalDate startDate, LocalDate endDate, 
        LocalDate courseStartRegistrationDate, LocalDate courseEndRegistrationDate, User lecturer, Boolean isActive){
        
        courseValidation(lecturer, courseName, courseStartRegistrationDate, 
                    courseEndRegistrationDate, startDate, endDate);
                    
        Course newCourse = new Course(courseName, startDate, endDate, courseStartRegistrationDate, 
            courseEndRegistrationDate, lecturer, isActive);
        return courseRepo.save(newCourse);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public Course createCourse(String courseName, LocalDate startDate, LocalDate endDate,
            LocalDate courseStartRegistrationDate, LocalDate courseEndRegistrationDate,
            User lecturer, Boolean isActive, Set<Course> preReqs) {

        courseValidation(lecturer, courseName, courseStartRegistrationDate, 
                    courseEndRegistrationDate, startDate, endDate);
        // Create and Persist
        Course newCourse = createCourse(courseName, startDate, endDate,
            courseStartRegistrationDate, courseEndRegistrationDate, lecturer, isActive);
            
        if (preReqs != null) {
            newCourse.setPrerequisites(preReqs);
        }

        return courseRepo.save(newCourse);
    }

    public List<Course> getAllCourses(){
        return courseRepo.findAll();
    }

    public List<Course> getLecturerCourses(User lecturer){
        return courseRepo.findByLecturer(lecturer);
    }

    public Set<Course> getCoursePrerequisite(Long courseId){
        Course course = getCourseById(courseId);
        return course.getPrerequisites();
    }

    public Course addPrerequisite(Long courseId, Long requisiteCourseId){
        Course course = getCourseById(courseId);
        Course requisitCourse = getCourseById(requisiteCourseId);
        for(Course prereq : course.getPrerequisites()){
            if (prereq.getName() == requisitCourse.getName()) {
                throw new RuntimeException("Course: " + requisitCourse.getName() + 
                    " already exists in course: " + course.getName() + " prerequisites.");
            }
        }

        course.addPrerequisite(requisitCourse);
        courseRepo.save(requisitCourse);
        return courseRepo.save(course);
    }

    public Course getCourseById(Long courseId) throws EntityNotFoundException{
        return courseRepo.findById(courseId)
            .orElseThrow(() -> new EntityNotFoundException("course with id: " + courseId + " not found"));
    }

    public void deleteCourseById(Long courseId){
        courseRepo.deleteById(courseId);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public Course editCourse(Long courseId, String courseName, LocalDate startDate, LocalDate endDate, 
        LocalDate courseStartRegistirationDate, LocalDate courseEndRegistirationDate, User lecturer, Boolean isActive){
        
        Course course = getCourseById(courseId);
        
        // validate course details before edit
        courseValidation(course.getLecturer(), courseName, courseStartRegistirationDate, 
                        courseEndRegistirationDate, startDate, endDate);
        
        if (courseName != null) {
            course.setName(courseName);
        }
        if (startDate != null) {
            course.setStartDate(startDate);
        }
        if (endDate != null) {
            course.setEndDate(endDate);
        }
        if (courseStartRegistirationDate != null) {
            course.setCourseStartRegistirationDate(courseStartRegistirationDate);
        }
        if (courseEndRegistirationDate != null) {
            course.setCourseEndRegistirationDate(courseEndRegistirationDate);
        }
        if (lecturer != null) {
            course.setLecturer(lecturer);
        }

        if (isActive != null) {
            course.setIsActive(isActive);
        }

        course.setUpdatedAt(LocalDate.now());
        return courseRepo.save(course);
    }
}
