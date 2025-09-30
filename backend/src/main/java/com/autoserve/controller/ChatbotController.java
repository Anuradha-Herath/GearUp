package com.autoserve.controller;

import com.autoserve.dto.ChatbotQueryDTO;
import com.autoserve.service.ChatbotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/query")
    public ResponseEntity<?> query(@RequestBody ChatbotQueryDTO query) {
        return ResponseEntity.ok(chatbotService.processQuery(query));
    }
}