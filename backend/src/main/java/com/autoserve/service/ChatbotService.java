package com.autoserve.service;

import com.autoserve.dto.ChatbotQueryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatbotService {

    @Autowired
    private VectorDBService vectorDBService;

    @Autowired
    private GeminiService geminiService;

    public String processQuery(ChatbotQueryDTO query) {
        try {
            if (query.getQuery() == null || query.getQuery().trim().isEmpty()) {
                return "Please provide a valid question.";
            }
            
            // Step 1: Search for relevant context in ChromaDB
            List<String> relevantContext = vectorDBService.searchRelevantContext(query.getQuery(), 5);
            
            System.out.println("Found " + relevantContext.size() + " relevant context documents");
            
            // Step 2: Send query + context to Gemini
            String response = geminiService.generateResponse(query.getQuery(), relevantContext);
            
            return response;
        } catch (Exception e) {
            System.err.println("Error processing chatbot query: " + e.getMessage());
            e.printStackTrace();
            return "I apologize, but I encountered an error processing your request. Please try again.";
        }
    }
}