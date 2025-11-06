# AutoServe Chatbot - Quick Reference Card

## 🚀 Start Everything (No Docker Required!)

```bash
# 1. Start Backend (easiest way)
./scripts/start-backend.sh

# OR manually:
cd backend
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
mvn clean spring-boot:run -DskipTests

# 2. Test (choose one)
./scripts/test-chatbot.sh              # CLI test
open docs/chatbot-test.html            # Browser test
```

## 📡 API

```bash
curl -X POST http://localhost:8080/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Your question here"}'
```

## 🔧 Configuration

**Gemini API Key**: `AIzaSyC_L2Rhw9kJyWrX767KfDT9GlDMYL9X-eQ`  
**Vector Store**: In-memory (no external setup needed)  
**Backend**: `http://localhost:8080`

## 💬 Example Questions

- What services do you offer?
- How do I book an appointment?
- What are the appointment statuses?
- Can I cancel my appointment?
- How much does a service cost?

## 🛠️ Troubleshooting

```bash
# Check if backend started successfully
# Look for: "✅ Vector database initialized successfully"
tail -f backend.log

# Test the endpoint
curl -X POST http://localhost:8080/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

## 📁 Key Files

**Backend**:
- `service/ChatbotService.java` - Main logic
- `service/VectorDBService.java` - ChromaDB sync
- `service/GeminiService.java` - AI integration

**Config**:
- `application.yml` - API keys & settings
- `pom.xml` - Dependencies

**Docs**:
- `CHATBOT_IMPLEMENTATION.md` - Full summary
- `docs/CHATBOT_QUICKSTART.md` - Quick start
- `docs/CHATBOT_SETUP.md` - Detailed setup

## 🔄 How It Works

```
Query → In-Memory Vector Search → Gemini API → Response
              ↑
          MySQL (auto-sync)
```

## ✅ What's Synced

- ✅ Services (create/update/delete)
- ✅ Appointments (create/update/delete)
- ✅ Knowledge base (static info)

## 🎯 Status

✅ In-memory vector store (no Docker!)  
✅ Gemini API integrated  
✅ Vector DB sync implemented  
✅ Knowledge base initialized  
✅ API endpoint ready  
✅ Test scripts created  
✅ Documentation complete  

**Ready to use - just start the backend!** 🎉
