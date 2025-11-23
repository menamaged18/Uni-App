package com.unisystem.university.auth;

import com.unisystem.university.users.User;
import com.unisystem.university.users.DTOS.UserResponse;

import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private UserResponse user; 

    public JwtResponse(String accessToken, User user) {
        this.token = accessToken;
        this.user = new UserResponse(user);
    }
}