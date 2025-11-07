# AutoServe Chatbot Documentation

Simple, clear documentation for the AutoServe AI chatbot.

## Quick Links

1. **[Folder Structure](01-folder-structure.md)** - Where everything is located
2. **[Architecture](02-architecture.md)** - How it's built
3. **[Request Flow](03-request-flow.md)** - How requests are processed

## Quick Overview

**What it does:**
- Answers questions about services, prices, appointments
- Provides car maintenance advice
- Helps with booking and navigation

**How it works:**
- User asks question
- System searches knowledge base
- AI generates response with context
- User gets helpful answer

**Technology:**
- Backend: Java/Spring Boot
- Frontend: React
- AI: Google Gemini
- Storage: In-memory vector database

## Key Features

✅ No external dependencies (no Docker, no ChromaDB)  
✅ Auto-syncs with MySQL database  
✅ Semantic search (understands meaning)  
✅ Context-aware AI responses  
✅ Real-time updates  

## Files

| Document | Description |
|----------|-------------|
| `01-folder-structure.md` | File organization |
| `02-architecture.md` | System design |
| `03-request-flow.md` | Request processing |

## Quick Start

1. Start backend: `./scripts/start-backend.sh`
2. Start frontend: `cd frontend && npm run dev`
3. Click chat icon (bottom-right)
4. Ask questions!

## Configuration

**Backend:** `backend/.env`
```env
GEMINI_API_KEY=your-api-key-here
```

**Application config:** `backend/src/main/resources/application.yml`
```yaml
gemini:
  api:
    key: ${GEMINI_API_KEY}
```

**Frontend:** Automatically connects to `http://localhost:8080/api/chatbot/query`

## Support

For detailed guides, see main documentation:
- `CHATBOT_FINAL_SUMMARY.md`
- `CHATBOT_QUICKSTART.md`
- `CHATBOT_TROUBLESHOOTING.md`
