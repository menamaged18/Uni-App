package com.unisystem.university.user;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.unisystem.university.secutity.JwtUtils;
import com.unisystem.university.secutity.SecurityConfig;
import com.unisystem.university.users.Role;
import com.unisystem.university.users.User;
import com.unisystem.university.users.UserController;
import com.unisystem.university.users.UserService;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class) // to load your security rules
public class UserControllerTest {
    @Autowired
    private MockMvc mockmvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtUtils jwtUtils;

    @Test
    @WithMockUser(roles = "ADMIN")
    public void createStudent_Test() throws Exception {
        // Arrange
        User mockUser = new User("Mina", "Mina@gmail.com", "pass");
        
        when(userService.createStudent(anyString(), anyString(), anyString()))
            .thenReturn(mockUser);

        String jsonRequest = """
            {
                "name": "Mina",
                "email": "Mina@gmail.com",
                "password": "pass"
            }
            """;

        // Act & Assert: Perform the POST and verify results
        mockmvc.perform(post("/api/users/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Mina"))
            .andExpect(jsonPath("$.email").value("Mina@gmail.com"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void getLecturer_Test() throws Exception {
        // Arrange 
        User lecturer = new User("lec", "lec@gmail.com", "pass");
        Long lecId = 1L;
        lecturer.setId(lecId);
        lecturer.setRole(Role.LECTURER);
        when(userService.getLecturer(lecId)).thenReturn(lecturer);

        // Act & Assert
        mockmvc.perform(get("/api/users/lecturers/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("lec"));
    }

    @Test
    @WithMockUser(roles = "SUPER_ADMIN")
    public void findAdminsByName_Test() throws Exception {
        // Arrange
        User admin1 = new User(1L, "admin1", "admin1@gmail.com", "pass", Role.ADMIN);
        User admin2 = new User(2L, "admin2", "admin2@gmail.com", "pass", Role.ADMIN);
        List<User> admins = List.of(admin1, admin2);

        String searchWord = "admin";
        when(userService.findAdminsByName(searchWord)).thenReturn(admins);

        // Act & Assert
        mockmvc.perform(get("/api/users/adminsByName")
                .param("searchWord", searchWord)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("admin1"))
                .andExpect(jsonPath("$[1].name").value("admin2"));

        verify(userService, times(1)).findAdminsByName(searchWord);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void deleteStudent_Test() throws Exception {
        // Arrange 
        doNothing().when(userService).deleteStudent(1l);

        mockmvc.perform(delete("/api/users/students/1"))
            .andExpect(status().isNoContent());

        verify(userService, times(1)).deleteStudent(1l);
    }
}
