package com.unisystem.university.users.DTOS;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserCreationReq {
    private String name;
    private String email;
    private String password; 
}
