package com.unisystem.university.lectureTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.unisystem.university.courses.Course;
import java.time.LocalTime;


@Repository
public interface LectureTimeRepo extends JpaRepository<LectureTime, Long>{
    List<LectureTime> findByCourse(Course course);
    List<LectureTime> findByDay(String day);
    List<LectureTime> findByTime(LocalTime time);
}
