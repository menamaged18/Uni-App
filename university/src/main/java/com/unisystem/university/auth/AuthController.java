package com.unisystem.university.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unisystem.university.secutity.JwtUtils;
import com.unisystem.university.users.User;
import com.unisystem.university.users.DTOS.LoginRequest;

import com.unisystem.university.users.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
             userService.loadUserByUsername(loginRequest.getEmail());
        } catch (UsernameNotFoundException e) {
             return new ResponseEntity<>("Error: The email provided does not exist.", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            // A. Authenticate the user (Check password)
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            // B. Set the Authentication in the context (Important for Spring Security)
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // C. GENERATE THE TOKEN (The missing piece)
            String jwt = jwtUtils.generateJwtToken(authentication);

            // D. Get User Details
            User user = (User) authentication.getPrincipal();
            
            // E. Return Token AND User
            // Replaces: return ResponseEntity.ok(new UserResponse(user));
            return ResponseEntity.ok(new JwtResponse(jwt, user)); 
            
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Error: The password is incorrect.", HttpStatus.UNAUTHORIZED);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>("Authentication failed", HttpStatus.UNAUTHORIZED);
        }
    }
}