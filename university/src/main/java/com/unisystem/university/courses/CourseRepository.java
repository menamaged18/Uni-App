package com.unisystem.university.courses;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unisystem.university.users.User;


@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByName(String name);
    List<Course> findByLecturer(User lecturer);
    List<Course> findByIsActive(Boolean isActive);
}
