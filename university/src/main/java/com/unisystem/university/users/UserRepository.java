package com.unisystem.university.users;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByNameAndRole(String name, Role role);
    // case-insensitive search:
    List<User> findByNameContainingIgnoreCaseAndRole(String name, Role role);
}
