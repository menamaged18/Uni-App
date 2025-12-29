package com.unisystem.university.courses;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unisystem.university.courses.DTOS.CourseCreationReq;
import com.unisystem.university.courses.DTOS.CourseUpdateReq;
import com.unisystem.university.secutity.JwtUtils;
import com.unisystem.university.secutity.SecurityConfig;
import com.unisystem.university.users.Role;
import com.unisystem.university.users.User;
import com.unisystem.university.users.UserService;

@WebMvcTest(CourseController.class)
@Import(SecurityConfig.class)
public class CoursesControllerTest {
    @Autowired
    private MockMvc mockmvc;

    @MockitoBean
    private CourseService courseService;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private long courseID = 1l;
    private String courseName = "Math-0";
    private LocalDate startDate = LocalDate.now();
    private LocalDate endDate = LocalDate.of(2026, 4, 22);
    private LocalDate regStartDate = LocalDate.of(2026, 1, 1);
    private LocalDate regEndDate = LocalDate.of(2026, 1, 10);
    private User lecturer = new User(1L, "lecturer", "lec@gmail.com", "pass", Role.LECTURER);

    @Test
    @WithMockUser(roles = "ADMIN")
    public void CreateCourse_Test() throws Exception {
        // Arrange
        Course newCourse = new Course(courseName, startDate, endDate, regStartDate, regEndDate, lecturer, true);        
        
        // mocking finding the lecturer
        when(userService.getUserByid(1l)).thenReturn(lecturer);
        
        // mocking the course creation
        when(courseService.createCourse(courseName, startDate, endDate, regStartDate, regEndDate, lecturer, true))
            .thenReturn(newCourse);
        

        // prepare request
        CourseCreationReq req = new CourseCreationReq(courseName, 
                startDate, endDate, regStartDate, regEndDate, 1l, null, true);
        
        mockmvc.perform(post("/api/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))
            )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value(courseName));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void getCourseById_Test() throws Exception{
        // Arrange 
        Course newCourse = new Course(courseID, courseName, endDate, startDate, 
                regStartDate, endDate, regEndDate, endDate, lecturer, 
                null, null, true);        
        when(courseService.getCourseById(1l)).thenReturn(newCourse);

        // Act & Asserts
        mockmvc.perform(get("/api/courses/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value(courseName));
    }
    
    @Test
    @WithMockUser
    public void getLecturerCourses_test() throws Exception {
        // Arrange
        Course Course1 = new Course(courseID, courseName, endDate, startDate, 
                regStartDate, endDate, regEndDate, endDate, lecturer, 
                null, null, true); 
        Course Course2 = new Course(2l, "Math-1", endDate, startDate, 
                regStartDate, endDate, regEndDate, endDate, lecturer, 
                null, null, true); 
        List<Course> courses = List.of(Course1, Course2);
        when(userService.getLecturer(1l)).thenReturn(lecturer);
        when(courseService.getLecturerCourses(lecturer)).thenReturn(courses);


        // Act & Asserts
        mockmvc.perform(get("/api/courses/by-lecturer/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void updateCourse_Test() throws Exception {
        // Arrange
        String newName = "Math-1";
        Course Course1 = new Course(courseID, newName, LocalDate.now(), LocalDate.now(),startDate, endDate,  
                regStartDate, regEndDate, lecturer, 
                null, null, true); 
        when(userService.getUserByid(1l)).thenReturn(lecturer);
        when(courseService.editCourse(courseID, newName, startDate, endDate, 
                            regStartDate, regEndDate, lecturer, true)).thenReturn(Course1);

        CourseUpdateReq updateReq = new CourseUpdateReq(newName, startDate, endDate,  
                regStartDate, regEndDate, 1l, true);
        
        // Act && Assert
        mockmvc.perform(patch("/api/courses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateReq))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value(newName));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void deleteCourse_test() throws Exception {
        // Arrange 
        doNothing().when(courseService).deleteCourseById(courseID);

        // Act && Asserts
        mockmvc.perform(delete("/api/courses/1"))
            .andExpect(status().isNoContent());

        verify(courseService, times(1)).deleteCourseById(courseID);
    }
}
