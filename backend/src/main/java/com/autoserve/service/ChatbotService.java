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
            
            String userQuery = query.getQuery().toLowerCase();
            
            // Determine how many results to fetch based on query type
            int limit = 5; // default
            if (userQuery.contains("service") || userQuery.contains("price") || 
                userQuery.contains("offer") || userQuery.contains("cost")) {
                limit = 15; // Get more results for service/price queries
            }
            
            // Step 1: Search for relevant context
            List<String> relevantContext = vectorDBService.searchRelevantContext(query.getQuery(), limit);
            
            System.out.println("Found " + relevantContext.size() + " relevant context documents for: " + query.getQuery());
            
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