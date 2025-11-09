package com.autoserve.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final OkHttpClient httpClient;
    private final Gson gson = new Gson();

    public GeminiService() {
        this.httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();
    }

    public String generateResponse(String userQuery, List<String> contextDocuments) {
        try {
            // Build context from retrieved documents
            StringBuilder contextBuilder = new StringBuilder();
            contextBuilder.append("You are a helpful assistant for AutoServe, an automobile service management system. ");
            contextBuilder.append("Use the following context to answer the user's question accurately.\n\n");
            
            contextBuilder.append("IMPORTANT INSTRUCTIONS:\n");
            contextBuilder.append("- You are GearUp AI, an assistant for automobile service management ONLY\n");
            contextBuilder.append("- ONLY answer questions related to: vehicle services, car problems, appointments, bookings, automotive maintenance, AutoServe system\n");
            contextBuilder.append("- If asked about unrelated topics (weather, sports, cooking, general knowledge, etc.), respond with:\n");
            contextBuilder.append("  'I'm GearUp AI, your automobile service assistant. I can help you with:\n");
            contextBuilder.append("  - Vehicle services and pricing\n");
            contextBuilder.append("  - Booking and managing appointments\n");
            contextBuilder.append("  - Car problems and maintenance advice\n");
            contextBuilder.append("  - Contact information\n\n");
            contextBuilder.append("  How can I help with your vehicle today?'\n");
            contextBuilder.append("- When asked about services or prices, LIST ALL services found in the context with their prices\n");
            contextBuilder.append("- When asked about appointment status, check if there are any appointments in the context and mention the most recent one\n");
            contextBuilder.append("- For car problems or issues, ALWAYS provide brief helpful advice/explanation first (1-2 sentences), THEN suggest relevant services\n");
            contextBuilder.append("- Example format: '[Brief advice about the issue]. [What might be causing it]. Our [Service Name] can help diagnose and fix this. [Link to services]'\n");
            contextBuilder.append("- For contact info (phone, location), provide the information from context with proper formatting\n");
            contextBuilder.append("- Always include relevant URLs from the context\n");
            contextBuilder.append("- Format lists clearly with bullet points or numbers\n");
            contextBuilder.append("- Use markdown formatting: **bold** for emphasis, [text](url) for links\n");
            contextBuilder.append("- For URLs, use markdown link format: [Click here](http://example.com) instead of plain URLs\n");
            contextBuilder.append("- Keep responses clear, helpful, and concise (2-4 sentences for general advice)\n");
            contextBuilder.append("- Always end car problem responses with: 'We're here to help! [View our services](http://localhost:5173/customer/services)'\n\n");
            
            contextBuilder.append("CONTEXT:\n");
            for (int i = 0; i < contextDocuments.size(); i++) {
                contextBuilder.append("Context ").append(i + 1).append(":\n").append(contextDocuments.get(i)).append("\n\n");
            }
            
            contextBuilder.append("USER QUESTION: ").append(userQuery);
            contextBuilder.append("\n\nProvide a helpful, accurate response based on the context above. ");
            contextBuilder.append("If asking about services/prices, list ALL services with their prices. ");
            contextBuilder.append("If asking about appointment status, mention any appointments found in the context.");

            // Build request payload
            JsonObject payload = new JsonObject();
            JsonArray contents = new JsonArray();
            JsonObject content = new JsonObject();
            JsonArray parts = new JsonArray();
            JsonObject part = new JsonObject();
            
            part.addProperty("text", contextBuilder.toString());
            parts.add(part);
            content.add("parts", parts);
            contents.add(content);
            payload.add("contents", contents);

            // Make API request to Gemini
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
            
            RequestBody body = RequestBody.create(
                gson.toJson(payload),
                MediaType.parse("application/json; charset=utf-8")
            );

            Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();

            System.out.println("Calling Gemini API...");
            
            try (Response response = httpClient.newCall(request).execute()) {
                String responseBody = response.body().string();
                
                System.out.println("Gemini API Status: " + response.code());
                
                if (!response.isSuccessful()) {
                    System.err.println("Gemini API Error - Status: " + response.code());
                    System.err.println("Response Body: " + responseBody);
                    return "I apologize, but I'm having trouble connecting to the AI service. Please try again.";
                }

                JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
                
                // Extract the generated text
                if (jsonResponse.has("candidates")) {
                    JsonArray candidates = jsonResponse.getAsJsonArray("candidates");
                    if (candidates != null && candidates.size() > 0) {
                        JsonObject candidate = candidates.get(0).getAsJsonObject();
                        if (candidate.has("content")) {
                            JsonObject contentObj = candidate.getAsJsonObject("content");
                            if (contentObj.has("parts")) {
                                JsonArray partsArray = contentObj.getAsJsonArray("parts");
                                if (partsArray != null && partsArray.size() > 0) {
                                    JsonObject textPart = partsArray.get(0).getAsJsonObject();
                                    if (textPart.has("text")) {
                                        String generatedText = textPart.get("text").getAsString();
                                        System.out.println("✅ Gemini response generated successfully");
                                        return generatedText;
                                    }
                                }
                            }
                        }
                    }
                }
                
                System.err.println("Could not extract text from response: " + responseBody);
                return "I apologize, but I couldn't generate a proper response. Please try again.";
            }
        } catch (Exception e) {
            System.err.println("❌ Error calling Gemini API: " + e.getMessage());
            e.printStackTrace();
            return "I apologize, but I'm experiencing technical difficulties. Please try again later.";
        }
    }
}
