package com.unisystem.university.courses;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;
import java.util.List;
import java.util.Arrays;
import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.unisystem.university.users.Role;
import com.unisystem.university.users.User;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {
    @Mock
    private CourseRepository mockCourseRepository;

    @InjectMocks
    private CourseService courseService; 

    private User mockLecturer;
    private Course mockCourse;
    private static final Long COURSE_ID = 1L;
    private static final String COURSE_NAME = "Java 101";
    private static final LocalDate START_DATE = LocalDate.of(2025, 2, 1);
    private static final LocalDate END_DATE = LocalDate.of(2025, 6, 1);
    private static final LocalDate REG_START_DATE = LocalDate.of(2025, 1, 1);
    private static final LocalDate REG_END_DATE = LocalDate.of(2025, 1, 31);

    @BeforeEach
    void setUp() {
        mockLecturer = new User();
        mockLecturer.setId(1L);
        mockLecturer.setName("Dr. Mina");
        mockLecturer.setEmail("minathelec@gmail.com");
        mockLecturer.setRole(Role.LECTURER);
        
        mockCourse = new Course(COURSE_NAME, START_DATE, END_DATE, REG_START_DATE, REG_END_DATE, mockLecturer, true);
        mockCourse.setId(COURSE_ID);
    }

    // --- Course Creation Success Cases ---

    @Test
    public void createCourse_Success() {
        // Arrange
        when(mockCourseRepository.findByName(COURSE_NAME)).thenReturn(Optional.empty());
        when(mockCourseRepository.save(any(Course.class))).thenReturn(mockCourse);
        
        // Act
        Course newCourse = courseService.createCourse(
            COURSE_NAME, START_DATE, END_DATE, REG_START_DATE, REG_END_DATE, mockLecturer, true
        );

        // Assert 
        assertNotNull(newCourse);
        assertEquals(COURSE_NAME, newCourse.getName());
        verify(mockCourseRepository).findByName(COURSE_NAME); 
        verify(mockCourseRepository).save(any(Course.class)); 
    }

    @Test
    public void createCourse_WithPrerequisites_Success() {
        // Arrange
        Course preReq1 = new Course("Intro to CS", LocalDate.now(), 
                    LocalDate.now().plusMonths(1), LocalDate.now(), 
                    LocalDate.now().plusDays(1), 
                    mockLecturer, true);
        Set<Course> preReqs = Set.of(preReq1);
        
        when(mockCourseRepository.findByName(COURSE_NAME)).thenReturn(Optional.empty());
        when(mockCourseRepository.save(any(Course.class))).thenReturn(mockCourse);
        
        // Act
        Course newCourse = courseService.createCourse(
            COURSE_NAME, START_DATE, END_DATE, REG_START_DATE, REG_END_DATE, mockLecturer, true, preReqs
        );

        // Assert 
        assertNotNull(newCourse);
        assertEquals(COURSE_NAME, newCourse.getName());
        assertEquals(1, newCourse.getPrerequisites().size());
        verify(mockCourseRepository, times(2)).save(any(Course.class)); 
    }

    // --- Validation Failure Tests ---

    @Test
    public void createCourse_DuplicateName_ThrowsException() {
        // Arrange
        when(mockCourseRepository.findByName(COURSE_NAME)).thenReturn(Optional.of(mockCourse));
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            courseService.createCourse(
                COURSE_NAME, START_DATE, END_DATE, REG_START_DATE, REG_END_DATE, mockLecturer, true
            );
        });

        assertEquals("Course name already exists", exception.getMessage());
        verify(mockCourseRepository, never()).save(any(Course.class)); // Must not save
    }

    @Test
    public void createCourse_NullLecturer_ThrowsException() {
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            courseService.createCourse(
                COURSE_NAME, START_DATE, END_DATE, REG_START_DATE, REG_END_DATE, null, true
            );
        });

        assertEquals("Course name and lecturer cannot be null or empty.", exception.getMessage());
    }

    @Test
    public void createCourse_InvalidRegistrationDates_ThrowsException() {
        // Arrange: Start registration after end registration
        LocalDate badRegStart = LocalDate.of(2025, 2, 1);
        LocalDate badRegEnd = LocalDate.of(2025, 1, 31); // Bad: After start
        when(mockCourseRepository.findByName(COURSE_NAME)).thenReturn(Optional.empty());
        
        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            courseService.createCourse(
                COURSE_NAME, START_DATE, END_DATE, badRegStart, badRegEnd, mockLecturer, true
            );
        });

        assertEquals("Course start registration date cannot be after the end registration date.", exception.getMessage());
    }

    @Test
    public void createCourse_InvalidCourseDates_ThrowsException() {
        // Arrange: Start date after end date
        LocalDate badStart = LocalDate.of(2025, 7, 1);
        LocalDate badEnd = LocalDate.of(2025, 6, 1);
        when(mockCourseRepository.findByName(COURSE_NAME)).thenReturn(Optional.empty());
        
        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            courseService.createCourse(
                COURSE_NAME, badStart, badEnd, REG_START_DATE, REG_END_DATE, mockLecturer, true
            );
        });

        assertEquals("Course start date cannot be after the course end date.", exception.getMessage());
    }

    @Test
    public void createCourse_RegistrationEndsAfterCourseStarts_ThrowsException() {
        // Arrange: Registration ends (Feb 15) after course starts (Feb 1)
        LocalDate courseStart = LocalDate.of(2025, 2, 1);
        LocalDate lateRegEnd = LocalDate.of(2025, 2, 15);
        when(mockCourseRepository.findByName(COURSE_NAME)).thenReturn(Optional.empty());
        
        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            courseService.createCourse(
                COURSE_NAME, courseStart, END_DATE, REG_START_DATE, lateRegEnd, mockLecturer, true
            );
        });

        assertEquals("Course registration must end before the course starts.", exception.getMessage());
    }

    // --- Other Method Tests 

    @Test
    public void getCourseById_Success() {
        // Arrange
        when(mockCourseRepository.findById(COURSE_ID)).thenReturn(Optional.of(mockCourse));

        // Act
        Course foundCourse = courseService.getCourseById(COURSE_ID);

        // Assert
        assertNotNull(foundCourse);
        assertEquals(COURSE_ID, foundCourse.getId());
        assertEquals(COURSE_NAME, foundCourse.getName());
    }

    @Test
    public void getCourseById_NotFound_ThrowsException() {
        // Arrange
        Long nonExistentId = 99L;
        when(mockCourseRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            courseService.getCourseById(nonExistentId);
        });

        assertEquals("course with id: " + nonExistentId + " not found", exception.getMessage());
    }
    
    @Test
    public void getAllCourses_Success() {
        // Arrange
        Course course2 = new Course("Math 101", START_DATE, END_DATE,
                                 REG_START_DATE, REG_END_DATE, mockLecturer, true);
        List<Course> expectedCourses = Arrays.asList(mockCourse, course2);
        when(mockCourseRepository.findAll()).thenReturn(expectedCourses);

        // Act
        List<Course> actualCourses = courseService.getAllCourses();

        // Assert
        assertEquals(2, actualCourses.size());
        assertEquals(COURSE_NAME, actualCourses.get(0).getName());
        verify(mockCourseRepository).findAll();
    }

    @Test
    public void getAllCourses_Failed(){
        // arrange
        when(mockCourseRepository.findAll()).thenReturn(Collections.emptyList());
        
        // act 
        List<Course> courses = courseService.getAllCourses();
        
        // Assert
        assertEquals(0, courses.size());
        assertTrue(courses.isEmpty());
    }
    
    @Test 
    public void getLecturerCourses_Success(){
        // arange
        List<Course> mockedlecturerCourses = Arrays.asList(mockCourse);
        when(mockCourseRepository.findByLecturer(mockLecturer)).thenReturn(mockedlecturerCourses);
        
        // act
        List<Course> returnedCourses = courseService.getLecturerCourses(mockLecturer);

        // asserts
        assertEquals(1, returnedCourses.size());
        assertEquals(mockedlecturerCourses, returnedCourses);
    }

    @Test
    public void getLecturerCourses_Failed(){
        // arange
        when(mockCourseRepository.findByLecturer(mockLecturer)).thenReturn(Collections.emptyList());

        // act
        List<Course> returnedCourses = courseService.getLecturerCourses(mockLecturer);
        
        // assert
        assertEquals(0, returnedCourses.size());
        assertTrue(returnedCourses.isEmpty());
    }

    @Test
    public void deleteCourseById_Success() {
        // Act
        courseService.deleteCourseById(COURSE_ID);

        // Assert
        // verify that the deleteById method on the repository was called exactly once with the correct ID.
        verify(mockCourseRepository, times(1)).deleteById(COURSE_ID);
    }

    // --- Course Editing Tests ---
    
    @Test
    public void editCourse_Success_PartialUpdate() {
        // Arrange
        String newName = "Java Advanced";
        LocalDate newEndDate = END_DATE.plusMonths(1);
        
        when(mockCourseRepository.findById(COURSE_ID)).thenReturn(Optional.of(mockCourse));
        // Mock save operation, which returns the updated course
        when(mockCourseRepository.save(any(Course.class))).thenAnswer(invocation -> {
            Course savedCourse = invocation.getArgument(0);
            savedCourse.setName(newName); 
            savedCourse.setEndDate(newEndDate);
            return savedCourse;
        });

        // Act
        Course updatedCourse = courseService.editCourse(
            COURSE_ID, newName, null, newEndDate, null, null, null, null
        );

        // Assert
        assertNotNull(updatedCourse);
        assertEquals(COURSE_ID, updatedCourse.getId());
        assertEquals(newName, updatedCourse.getName()); // Should be updated
        assertEquals(newEndDate, updatedCourse.getEndDate()); // Should be updated
        assertEquals(mockCourse.getStartDate(), updatedCourse.getStartDate()); // remain the same
        assertNotNull(updatedCourse.getUpdatedAt()); // Should be set by the service
        verify(mockCourseRepository).findById(COURSE_ID);
        verify(mockCourseRepository).save(any(Course.class));
    }
    
    @Test
    public void editCourse_Success_FullUpdate() {
        // Arrange
        String newName = "Updated Java Course";
        User newLecturer = new User();
        newLecturer.setId(2L);
        newLecturer.setRole(Role.LECTURER);
        
        when(mockCourseRepository.findById(COURSE_ID)).thenReturn(Optional.of(mockCourse));
        // Mock save operation
        when(mockCourseRepository.save(any(Course.class))).thenAnswer(invocation -> {
            Course savedCourse = invocation.getArgument(0);
            savedCourse.setName(newName); 
            savedCourse.setLecturer(newLecturer);
            return savedCourse;
        });

        // Act
        Course updatedCourse = courseService.editCourse(
            COURSE_ID, newName, START_DATE, END_DATE, REG_START_DATE, REG_END_DATE, newLecturer, false
        );

        // Assert
        assertNotNull(updatedCourse);
        assertEquals(newName, updatedCourse.getName());
        assertEquals(newLecturer.getId(), updatedCourse.getLecturer().getId());
        assertEquals(false, updatedCourse.getIsActive());
        verify(mockCourseRepository).save(any(Course.class));
    }

}