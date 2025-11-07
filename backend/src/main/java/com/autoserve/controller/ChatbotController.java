package com.autoserve.controller;

import com.autoserve.dto.ChatbotQueryDTO;
import com.autoserve.dto.ChatbotResponseDTO;
import com.autoserve.service.ChatbotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/query")
    public ResponseEntity<ChatbotResponseDTO> query(@RequestBody ChatbotQueryDTO query) {
        try {
            String response = chatbotService.processQuery(query);
            return ResponseEntity.ok(new ChatbotResponseDTO(response));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(ChatbotResponseDTO.error("Failed to process query: " + e.getMessage()));
        }
    }
}