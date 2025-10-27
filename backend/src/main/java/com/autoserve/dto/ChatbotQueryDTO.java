package com.autoserve.dto;

import lombok.Data;

@Data
public class ChatbotQueryDTO {
    private String query;

    // Manual getters and setters for compilation if Lombok fails
    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}