package com.unisystem.university.user;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.unisystem.university.secutity.JwtUtils;
import com.unisystem.university.secutity.SecurityConfig;
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

        // 2. Act & 3. Assert: Perform the POST and verify results
        mockmvc.perform(post("/api/users/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Mina"))
            .andExpect(jsonPath("$.email").value("Mina@gmail.com"));
    }
}
