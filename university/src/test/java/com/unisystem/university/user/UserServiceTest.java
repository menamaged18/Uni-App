package com.unisystem.university.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.unisystem.university.users.Role;
import com.unisystem.university.users.User;
import com.unisystem.university.users.UserRepository;
import com.unisystem.university.users.UserService;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository mockedRepo;

    @InjectMocks
    private UserService userService;

    @Mock 
    private PasswordEncoder passwordEncoder;

    User newUser;
    private Long userId = 1l;
    private String userName = "user";
    private String email = "user@gmail.com";
    private String password = "pass";


    @BeforeEach
    public void setUp(){
        newUser = new User(userName, email, password);
        newUser.setId(userId);
    }

    // --- get user Tests --- 
    @Test
    public void getUser_Success(){
        // arrange
        when(mockedRepo.findById(userId)).thenReturn(Optional.of(newUser));

        // act 
        User user = userService.getUserByid(userId);

        // assert
        assertEquals(newUser, user);
    }

    @Test
    public void getUser_NotFound(){
        // arrange 
        Long nonExistentId = 99L;
        when(mockedRepo.findById(nonExistentId)).thenReturn(Optional.empty());

        // act && assert
        assertThrows(EntityNotFoundException.class, () -> {
            userService.getUserByid(nonExistentId);
        });

        verify(mockedRepo, times(1)).findById(nonExistentId);
    }

    @Test
    public void getAllStudents_Success(){
        // arrange
        newUser.setRole(Role.STUDENT);
        User student2 = new User("Student", "student2@gmail.com", "Pass");
        student2.setId(2l);
        student2.setRole(Role.STUDENT);
        List<User> expStudents = Arrays.asList(student2, newUser);
        when(mockedRepo.findByRole(Role.STUDENT)).thenReturn(expStudents);

        // act
        List<User> students = userService.getAllStudents();

        // assert
        assertEquals(expStudents, students);
    }

    @Test
    public void getAllStudents_EmptyList() {
        // arrange
        when(mockedRepo.findByRole(Role.STUDENT)).thenReturn(Collections.emptyList());

        // Act
        List<User> actualStudents = userService.getAllStudents();

        // Assert
        assertTrue(actualStudents.isEmpty());
        verify(mockedRepo, times(1)).findByRole(Role.STUDENT);
    }

    @Test
    public void findLecturersByName_Success(){
        // Arrange
        newUser.setRole(Role.LECTURER);
        List<User> foundedUsers = Arrays.asList(newUser);
        when(mockedRepo.findByNameContainingIgnoreCaseAndRole(userName, Role.LECTURER)).thenReturn(foundedUsers);

        // Act
        List<User> actualFound = userService.findLecturersByName(userName);

        // Assert
        assertEquals(foundedUsers, actualFound);
    }

    @Test
    public void findLecturersByName_EmptyList(){
        // Arrange
        when(mockedRepo.findByNameContainingIgnoreCaseAndRole(userName, Role.LECTURER)).thenReturn(Collections.emptyList());

        // Act
        List<User> actualFound = userService.findLecturersByName(userName);

        // Assert
        assertEquals(0, actualFound.size());
        assertTrue(actualFound.isEmpty());
    }

    @Test
    public void createAdmin_success(){
        // arrange
        newUser.setRole(Role.ADMIN);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(mockedRepo.save(any(User.class))).thenReturn(newUser);

        // act
        User newAdmin = userService.createAdmin(userName, email, password);
        newAdmin.setRole(Role.ADMIN);

        // assert
        assertEquals(newAdmin, newUser);
    }

    @Test
    public void deleteStudent_Success(){
        // arrange
        newUser.setRole(Role.STUDENT);
        when(mockedRepo.findById(userId)).thenReturn(Optional.of(newUser));
        doNothing().when(mockedRepo).deleteById(userId);

        // act
        userService.deleteStudent(userId);

        // assert & verification
        verify(mockedRepo, times(1)).deleteById(userId);
    }

    @Test
    public void deleteStudent_NotStudentRole(){
        // arrange
        newUser.setRole(Role.LECTURER);
        when(mockedRepo.findById(userId)).thenReturn(Optional.of(newUser));

        // act & assert
        Exception exception = assertThrows(IllegalArgumentException.class, ()->{
            userService.deleteStudent(userId);
        });

        String message = "Cannot delete user with role: " + newUser.getRole() + 
                    ". Requires explicit high-level approval or self-deletion is forbidden.";

        assertEquals(message, exception.getMessage());
    }
}
