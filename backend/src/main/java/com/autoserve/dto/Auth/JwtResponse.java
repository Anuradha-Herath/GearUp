package com.autoserve.dto.Auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class JwtResponse {
    @JsonProperty("token")
    private String token;
    
    @JsonProperty("type")
    private String type = "Bearer";
    
    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("role")
    private String role;

    public JwtResponse(String accessToken, Long id, String username, String email, String role) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}