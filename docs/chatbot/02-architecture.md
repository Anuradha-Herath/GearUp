# Chatbot Architecture

## Overview

RAG (Retrieval-Augmented Generation) architecture using in-memory vector database and Gemini AI.

## Components

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────┐
│  Frontend (React)           │
│  - ChatbotWidget.jsx        │
│  - chatbotService.js        │
└──────┬──────────────────────┘
       │ HTTP POST /api/chatbot/query
       ↓
┌─────────────────────────────┐
│  Backend (Spring Boot)      │
│                             │
│  ChatbotController          │
│         ↓                   │
│  ChatbotService             │
│    ↙          ↘             │
│  VectorDB    Gemini         │
│  Service     Service        │
│    ↓            ↓           │
│  Simple      Gemini         │
│  Vector      API            │
│  Store                      │
└─────────────────────────────┘
       ↑
       │ Auto-sync
       ↓
┌─────────────────────────────┐
│  MySQL Database             │
│  - Services                 │
│  - Appointments             │
└─────────────────────────────┘
```

## Technology Stack

**Backend:**
- Spring Boot 3.2.0
- Java 17
- OkHttp (HTTP client)
- Gson (JSON parsing)

**Frontend:**
- React
- Tailwind CSS

**AI:**
- Google Gemini API (gemini-2.5-flash)

**Storage:**
- MySQL (primary data)
- In-memory vector store (search)

## Data Flow

1. **User Input** → Frontend
2. **API Call** → Backend
3. **Vector Search** → Find relevant context
4. **AI Generation** → Generate response with context
5. **Response** → User

## Key Features

- In-memory vector database (no external dependencies)
- Automatic data sync from MySQL
- Semantic search
- Context-aware AI responses
- Real-time updates
