# AutoServe AI Chatbot

An intelligent chatbot for AutoServe that helps users understand the system, explore services, and get information about appointments using RAG (Retrieval-Augmented Generation) architecture.

## 🎯 Features

- **Service Information**: Ask about available services, prices, and durations
- **Appointment Help**: Learn how to book, cancel, and track appointments
- **System Knowledge**: Understand how AutoServe works
- **Real-time Sync**: Automatically updates when services or appointments change
- **Natural Language**: Conversational AI powered by Google Gemini

## 🏗️ Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ Query
       ↓
┌─────────────────────────────────────┐
│      Java Backend                   │
│  ┌──────────────────────────────┐  │
│  │   ChatbotService             │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│    ┌────────┴────────┐             │
│    ↓                 ↓             │
│ ┌──────────┐   ┌──────────┐       │
│ │ ChromaDB │   │  Gemini  │       │
│ │ (Vector) │   │   API    │       │
│ └──────────┘   └──────────┘       │
│      ↑                             │
│      │ Sync on CRUD                │
│ ┌────┴─────┐                       │
│ │  MySQL   │                       │
│ └──────────┘                       │
└─────────────────────────────────────┘
```

## 📦 Components

### 1. VectorDBService
- Manages ChromaDB collections (services, appointments, knowledge_base)
- Syncs data from MySQL to vector database
- Performs semantic search for relevant context

### 2. GeminiService
- Integrates with Google Gemini API
- Generates natural language responses
- Uses retrieved context for accurate answers

### 3. ChatbotService
- Orchestrates the RAG pipeline
- Combines vector search with AI generation
- Handles error cases gracefully

### 4. ChromaDBConfig
- Configures ChromaDB client
- Manages connection settings

## 🔄 Data Flow

### When Services/Appointments Change:

```
MySQL CRUD Operation
    ↓
ServiceService / AppointmentService
    ↓
VectorDBService.add/update/delete()
    ↓
ChromaDB (embeddings updated)
```

### When User Asks a Question:

```
User Query
    ↓
ChatbotController
    ↓
ChatbotService
    ↓
VectorDBService.searchRelevantContext()
    ↓
ChromaDB (semantic search - top 5 results)
    ↓
GeminiService.generateResponse()
    ↓
Gemini API (with context)
    ↓
Natural Language Response
```

## 🚀 Quick Start

See [CHATBOT_QUICKSTART.md](./CHATBOT_QUICKSTART.md) for setup instructions.

## 📚 Documentation

- [Setup Guide](./CHATBOT_SETUP.md) - Detailed setup and configuration
- [Quick Start](./CHATBOT_QUICKSTART.md) - Get running in 3 steps

## 🔑 Configuration

### application.yml

```yaml
gemini:
  api:
    key: ${GEMINI_API_KEY}
    url: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent

chroma:
  host: ${CHROMA_HOST:localhost}
  port: ${CHROMA_PORT:8000}
```

## 📡 API

### POST /api/chatbot/query

**Request:**
```json
{
  "query": "What services do you offer?",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "response": "AutoServe offers various automobile services including oil changes, tire rotations, brake services, and more...",
  "success": true,
  "error": null
}
```

## 🧪 Testing

```bash
# Start ChromaDB
./scripts/start-chromadb.sh

# Start backend
cd backend && ./apache-maven-3.9.9/bin/mvn spring-boot:run

# Run tests
./scripts/test-chatbot.sh
```

## 🛠️ Technologies

- **ChromaDB** - Vector database for semantic search
- **Google Gemini** - AI language model
- **OkHttp** - HTTP client for API calls
- **Gson** - JSON parsing
- **Spring Boot** - Backend framework

## 📊 Knowledge Base

The chatbot knows about:
- System features and capabilities
- Available services and pricing
- Appointment booking process
- Appointment statuses and lifecycle
- Customer and vehicle management
- Real-time notifications

## 🔒 Security

- API keys stored in environment variables
- CORS enabled for frontend integration
- Input validation on queries
- Error handling for API failures

## 🎨 Customization

### Add Custom Knowledge

Edit `VectorDBService.initializeKnowledgeBase()`:

```java
List<String> documents = Arrays.asList(
    "Your custom knowledge here",
    "More information about your business",
    // ...
);
```

### Adjust Search Results

Change the number of context documents:

```java
// In ChatbotService.processQuery()
List<String> relevantContext = vectorDBService.searchRelevantContext(query.getQuery(), 5); // Change 5 to desired number
```

### Modify AI Behavior

Edit `GeminiService.generateResponse()` to adjust:
- Temperature (creativity)
- Max tokens (response length)
- System prompt (behavior)

## 📈 Future Enhancements

- [ ] User-specific context (personalized responses)
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Conversation history
- [ ] Analytics and insights
- [ ] Feedback mechanism
- [ ] Response caching
- [ ] Rate limiting

## 🐛 Troubleshooting

See [CHATBOT_SETUP.md](./CHATBOT_SETUP.md#troubleshooting) for common issues and solutions.

## 📄 License

Part of the AutoServe project.
