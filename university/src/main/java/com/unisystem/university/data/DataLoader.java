package com.unisystem.university.data;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.unisystem.university.users.Role;
import com.unisystem.university.users.User;
import com.unisystem.university.users.UserRepository;

@Component
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String email = "mina@gmail.com";
        if (userRepo.findByEmail(email).isEmpty()) {
            User u = new User("mina", email, passwordEncoder.encode("pass"));
            u.setRole(Role.SUPER_ADMIN);
            userRepo.save(u);
            System.out.println("Super admin created: " + email);
        } else {
            System.out.println("Super admin already exists: " + email);
        }
    }
}

