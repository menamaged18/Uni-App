package com.unisystem.university.lectureTime;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.unisystem.university.courses.Course;

import jakarta.persistence.EntityNotFoundException;

@Service
public class LectureTimeService {
    private LectureTimeRepo lectureTimeRepo;

    public LectureTimeService(LectureTimeRepo lectureTimeRepo){
        this.lectureTimeRepo = lectureTimeRepo;
    }

    public List<LectureTime> getCourseLectureTimes(Course course){
        return lectureTimeRepo.findByCourse(course);
    }

    public List<LectureTime> getDayLectureTimes(String day){
        return lectureTimeRepo.findByDay(day);
    }

    public List<LectureTime> getDayLectureTimesWithinYear(String day, int year){
        List<LectureTime> lectures = lectureTimeRepo.findByDay(day).stream()
            .filter(lec -> lec.getCourse().getCreatedAt().getYear() == year)
            .collect(Collectors.toList());
        return lectures;
    }    

    public List<LectureTime> getAllLecturesTime(){
        return lectureTimeRepo.findAll();
    }

    public LectureTime getLectureTimeById(Long LectureTimeId) throws EntityNotFoundException{
        return lectureTimeRepo.findById(LectureTimeId).orElseThrow(() -> 
            new EntityNotFoundException("Lecture Time with Id: " + LectureTimeId + " not found"));
    }

    public void deleteLectureTimeById(Long lectureTimeId){
        lectureTimeRepo.deleteById(lectureTimeId);
    }

    public LectureTime addLectureTime(Course course, Day day, LocalTime time){
        return lectureTimeRepo.save(new LectureTime(course, day, time));
    }
}
