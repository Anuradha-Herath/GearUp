package com.autoserve.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatbotResponseDTO {
    private String response;
    private boolean success;
    private String error;

    public ChatbotResponseDTO(String response) {
        this.response = response;
        this.success = true;
    }

    public static ChatbotResponseDTO error(String errorMessage) {
        ChatbotResponseDTO dto = new ChatbotResponseDTO();
        dto.setSuccess(false);
        dto.setError(errorMessage);
        return dto;
    }
}
