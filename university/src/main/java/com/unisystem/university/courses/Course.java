package com.unisystem.university.courses;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import com.unisystem.university.lectureTime.LectureTime;
import com.unisystem.university.users.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate createdAt = LocalDate.now();
    private LocalDate updatedAt;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate courseStartRegistirationDate;
    private LocalDate courseEndRegistirationDate;

    @ManyToOne
    @JoinColumn(name = "lecturer_id")
    private User lecturer;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<LectureTime> lecturesTime;

    // Courses required to take *this* course
    @ManyToMany
    @JoinTable(
        name = "course_prerequisites", // Name of the new junction/linking table
        joinColumns = @JoinColumn(name = "course_id"), // FK for THIS course
        inverseJoinColumns = @JoinColumn(name = "prerequisite_id") // FK for the REQUIRED course
    )
    @ToString.Exclude
    private Set<Course> prerequisites;

    // to be added later because this causes circular dependency problem
    // Courses that require *this* course as a prerequisite
    // @ManyToMany(mappedBy = "prerequisites") 
    // private Set<Course> requiredFor;

    private Boolean isActive;

    public Course(String courseName, LocalDate startDate, LocalDate endDate, 
        LocalDate courseStartRegistirationDate, LocalDate courseEndRegistirationDate, User lecturer, Boolean isActive){
        this.name = courseName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.courseStartRegistirationDate = courseStartRegistirationDate;
        this.courseEndRegistirationDate = courseEndRegistirationDate;
        this.lecturer = lecturer;
        this.isActive = isActive;
    }

    // helper functions

    public void addPrerequisite(Course course){
        prerequisites.add(course);
    }

    // public void addRequiredFor(Course course){
    //     requiredFor.add(course);
    // }

    public void removePrerequisite(Course course) {
        prerequisites.remove(course);
    }

    // public void removeRequiredFor(Course course) {
    //     requiredFor.remove(course);
    // }

}
