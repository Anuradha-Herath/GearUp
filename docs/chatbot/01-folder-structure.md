# Chatbot Folder Structure

## Backend (Java/Spring Boot)

```
backend/src/main/java/com/autoserve/
├── controller/
│   └── ChatbotController.java          # REST API endpoint
├── service/
│   ├── ChatbotService.java             # Main chatbot logic
│   ├── GeminiService.java              # Gemini AI integration
│   ├── VectorDBService.java            # Vector database operations
│   └── SimpleVectorStore.java          # In-memory vector storage
├── dto/
│   ├── ChatbotQueryDTO.java            # Request structure
│   └── ChatbotResponseDTO.java         # Response structure
└── config/
    └── SecurityConfig.java             # Security settings (permitAll for /api/chatbot/**)
```

## Frontend (React)

```
frontend/src/
├── components/
│   └── chatbot/
│       └── ChatbotWidget.jsx           # Chat UI component
├── services/
│   └── chatbotService.js               # API calls
└── App.jsx                             # ChatbotWidget imported here
```

## Configuration

```
backend/src/main/resources/
└── application.yml                     # Gemini API key configuration
```

## Key Files

| File | Purpose |
|------|---------|
| `ChatbotController.java` | Receives HTTP requests |
| `ChatbotService.java` | Orchestrates search + AI |
| `VectorDBService.java` | Manages knowledge base |
| `GeminiService.java` | Calls Gemini API |
| `SimpleVectorStore.java` | Stores & searches documents |
| `ChatbotWidget.jsx` | UI component |
| `chatbotService.js` | Frontend API client |
