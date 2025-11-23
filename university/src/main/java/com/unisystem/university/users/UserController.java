package com.unisystem.university.users;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.unisystem.university.users.DTOS.UserCreationReq;
import com.unisystem.university.users.DTOS.UserResponse;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // --- GET ALL (Filtered by Role) ---

    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllStudents() {
        List<User> students = userService.getAllStudents();
        return ResponseEntity.ok(students.stream()
                .map(UserResponse:: new)
                .collect(Collectors.toList()));
    }

    @GetMapping("/studentsByName")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllStudentsByName(@RequestParam String searchWord) {
        List<User> students = userService.findStudentsByName(searchWord);
        return ResponseEntity.ok(students.stream()
                .map(UserResponse:: new)
                .collect(Collectors.toList()));
    }


    @GetMapping("/lecturers")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllLecturers() {
        List<User> lecturers = userService.getAllLecturers();
        return ResponseEntity.ok(lecturers.stream()
                .map(UserResponse:: new)
                .collect(Collectors.toList()));
    }

    @GetMapping("/lecturersByName")
    public ResponseEntity<List<UserResponse>> getAllLecturersByName(@RequestParam String searchWord) {
        List<User> students = userService.findLecturersByName(searchWord);
        return ResponseEntity.ok(students.stream()
                .map(UserResponse:: new)
                .collect(Collectors.toList()));
    }

    @GetMapping("/admins")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllAdmins() {
        List<User> admins = userService.getAllAdmins();
        return ResponseEntity.ok(admins.stream()
                .map(UserResponse:: new)
                .collect(Collectors.toList()));
    }

    @GetMapping("/adminsByName")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllAdminsByName(@RequestParam String searchWord) {
        List<User> students = userService.findAdminsByName(searchWord);
        return ResponseEntity.ok(students.stream()
                .map(UserResponse:: new)
                .collect(Collectors.toList()));
    }

    // --- GET BY ID (Filtered by Role) ---

    @GetMapping("/students/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<UserResponse> getStudent(@PathVariable Long id) {
        User user = userService.getStudent(id);
        return ResponseEntity.ok(new UserResponse(user));
    }

    @GetMapping("/lecturers/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<UserResponse> getLecturer(@PathVariable Long id) {
        User user = userService.getLecturer(id);
        return ResponseEntity.ok(new UserResponse(user));
    }

    @GetMapping("/admins/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> getAdmin(@PathVariable Long id) {
        User user = userService.getAdmin(id);
        return ResponseEntity.ok(new UserResponse(user));
    }

    // --- CREATE (Filtered by Role) ---

    @PostMapping("/students")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> createStudent(@RequestBody UserCreationReq createDTO) {
        User student = userService.createStudent(createDTO.getName(), createDTO.getEmail(), createDTO.getPassword());
        return new ResponseEntity<>(new UserResponse(student), HttpStatus.CREATED);
    }

    @PostMapping("/lecturers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> createLecturer(@RequestBody UserCreationReq createDTO) {
        User lecturer = userService.createLecturer(createDTO.getName(), createDTO.getEmail(), createDTO.getPassword());
        return new ResponseEntity<>(new UserResponse(lecturer), HttpStatus.CREATED);
    }

    @PostMapping("/admins")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> createAdmin(@RequestBody UserCreationReq createDTO) {
        User admin = userService.createAdmin(createDTO.getName(), createDTO.getEmail(), createDTO.getPassword());
        return new ResponseEntity<>( new UserResponse(admin), HttpStatus.CREATED);
    }

    // --- DELETE (Filtered by Role) ---

    @DeleteMapping("/students/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        userService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/admins/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        userService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }

}