# AutoServe Chatbot - Quick Start

## 🚀 Get Started in 2 Steps (No Docker Required!)

### Step 1: Start the Backend

```bash
cd backend
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
mvn clean spring-boot:run -DskipTests
```

The application will:
- Initialize the in-memory vector database
- Load the knowledge base
- Start syncing services and appointments

Look for these success messages:
```
✅ Vector database initialized successfully (in-memory mode)
✅ Knowledge base initialized with 10 documents
```

### Step 2: Test the Chatbot

```bash
./scripts/test-chatbot.sh
```

Or manually:

```bash
curl -X POST http://localhost:8080/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What services do you offer?"}'
```

## 💬 Example Queries

Try asking:
- "What services do you offer?"
- "How do I book an appointment?"
- "What are the appointment statuses?"
- "Can I cancel my appointment?"
- "What information do I need to book?"
- "How long does a service take?"
- "What are your prices?"

## 🔧 Configuration

The chatbot is pre-configured with:
- **Gemini API Key**: Already set in `application.yml`
- **Vector Store**: In-memory (no external dependencies!)
- **Model**: gemini-2.0-flash-exp

## 📊 How It Works

```
User Query
    ↓
In-Memory Vector Search (finds relevant context)
    ↓
Gemini API (generates response with context)
    ↓
Natural Language Response
```

## 🛠️ Troubleshooting

**Backend errors?**
- Verify Gemini API key is valid
- Check logs: `tail -f backend.log`

**No responses?**
- Ensure services exist in your database
- Check vector DB sync in logs (should see "✅ Vector database initialized")
- Verify Gemini API quota

## 📝 API Endpoint

```
POST /api/chatbot/query
```

**Request:**
```json
{
  "query": "Your question here",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "response": "AI-generated answer",
  "success": true,
  "error": null
}
```

## 🎯 Next Steps

1. Add more services to see richer responses
2. Create appointments to test appointment queries
3. Customize the knowledge base in `VectorDBService.java`
4. Integrate with your frontend

For detailed documentation, see [CHATBOT_SETUP.md](./CHATBOT_SETUP.md)
