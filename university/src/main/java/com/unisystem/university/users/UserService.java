package com.unisystem.university.users;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;


@Service
public class UserService implements UserDetailsService{
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException{
        return userRepo.findByEmail(userEmail).orElseThrow( () -> 
            new UsernameNotFoundException("Email: "+ userEmail + " not found")
        );
    }
    
    // helper function to get user
    public User getUserByid(Long id) throws EntityNotFoundException {
        return userRepo.findById(id).orElseThrow(() -> 
            new EntityNotFoundException("user not found"));
    }
    
    public void userExists(String email){
        if (userRepo.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email: " + email + " already exists.");
        }
    }

    // get single user
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('STUDENT')")
    public User getStudent(Long studentId){
        User user = getUserByid(studentId);
        if (user.getRole() != Role.STUDENT) {
            throw new IllegalArgumentException(
                "Cannot fetch user with role: " + user.getRole() + 
                ". Requires explicit high-level approval or self-deletion is forbidden."
            );
        }
        return user;
    }

    // @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('LECTURER')")
    // the case that made me remove the preQuthorize is when i try to get all the lecturer courses
    // because if a student wants to know the lectcurer courses
    public User getLecturer(Long lecturerId){
        User user = getUserByid(lecturerId);
        if (user.getRole() != Role.LECTURER) { 
            throw new IllegalArgumentException(
                "Cannot fetch user " +
                "Requires explicit high-level approval."
            );
        }
        return user;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public User getAdmin(Long AdminId){
        return getUserByid(AdminId);
    }

    // getAll
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public List<User> getAllStudents(){
        return userRepo.findByRole(Role.STUDENT);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public List<User> findStudentsByName(String userName){
        return userRepo.findByNameContainingIgnoreCaseAndRole(userName, Role.STUDENT);
    }

    public List<User> getAllLecturers(){
        return userRepo.findByRole(Role.LECTURER);
    }

    public List<User> findLecturersByName(String userName){
        return userRepo.findByNameContainingIgnoreCaseAndRole(userName, Role.LECTURER);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<User> getAllAdmins(){
        return userRepo.findByRole(Role.ADMIN);
    }

    public List<User> findAdminsByName(String userName){
        return userRepo.findByNameContainingIgnoreCaseAndRole(userName, Role.ADMIN);
    }

    // Creation
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public User createStudent(String name, String email, String password) {
        userExists(email);
        User student = new User(name, email,  passwordEncoder.encode(password));
        student.setRole(Role.STUDENT);
        return userRepo.save(student);
    }
    
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public User createLecturer(String name, String email, String password) {
        userExists(email);
        User lecturer = new User(name, email,  passwordEncoder.encode(password));
        lecturer.setRole(Role.LECTURER);
        return userRepo.save(lecturer);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public User createAdmin(String name, String email, String password) {
        userExists(email);
        User admin = new User(name, email,  passwordEncoder.encode(password));
        admin.setRole(Role.ADMIN);
        return userRepo.save(admin);
    }

    // Deletion
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public void deleteStudent(Long id){
        User user = getUserByid(id);
        if (user.getRole() != Role.STUDENT) {
            throw new IllegalArgumentException(
                "Cannot delete user with role: " + user.getRole() + 
                ". Requires explicit high-level approval or self-deletion is forbidden."
            );
        }else{
            userRepo.deleteById(id);
        }
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void deleteAdmin(Long adminId) {
        userRepo.deleteById(adminId);
    }
}   
