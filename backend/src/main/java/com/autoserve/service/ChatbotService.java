package com.autoserve.service;

import com.autoserve.dto.ChatbotQueryDTO;
import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    public String processQuery(ChatbotQueryDTO query) {
        // Implement chatbot logic
        return "Response to: " + query.getQuery();
    }
}