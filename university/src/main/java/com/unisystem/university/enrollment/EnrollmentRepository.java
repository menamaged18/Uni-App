package com.unisystem.university.enrollment;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.unisystem.university.courses.Course;
import com.unisystem.university.users.User;



@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long>{
    List<Enrollment> findByCourse(Course course);
    List<Enrollment> findByStudent(User student);
    Optional<Enrollment> findByStudentAndCourse(User student, Course course);
    boolean existsByStudentAndCourseAndSemester(User student, Course course, Integer semester);
}
