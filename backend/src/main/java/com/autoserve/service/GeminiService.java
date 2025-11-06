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
            contextBuilder.append("Use the following context to answer the user's question accurately:\n\n");
            
            for (int i = 0; i < contextDocuments.size(); i++) {
                contextBuilder.append("Context ").append(i + 1).append(": ").append(contextDocuments.get(i)).append("\n");
            }
            
            contextBuilder.append("\nUser Question: ").append(userQuery);
            contextBuilder.append("\n\nProvide a helpful, accurate response based on the context above. ");
            contextBuilder.append("If the context doesn't contain enough information, say so politely.");

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
