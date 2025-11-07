# Request Processing Flow

## Simple Flow

```
User types message
    ↓
Frontend sends to /api/chatbot/query
    ↓
ChatbotController receives request
    ↓
ChatbotService processes query
    ↓
VectorDBService searches for relevant context
    ↓
GeminiService generates response with context
    ↓
Response sent back to user
```

## Detailed Steps

### 1. User Input
```javascript
User: "What services do you offer?"
```

### 2. Frontend API Call
```javascript
POST /api/chatbot/query
Body: { "query": "What services do you offer?" }
```

### 3. Backend Processing

**ChatbotController:**
```java
@PostMapping("/query")
public ResponseEntity<ChatbotResponseDTO> query(@RequestBody ChatbotQueryDTO query)
```

**ChatbotService:**
```java
// Determine how many results to fetch
int limit = query.contains("service") ? 15 : 5;

// Search vector database
List<String> context = vectorDBService.searchRelevantContext(query, limit);

// Generate AI response
String response = geminiService.generateResponse(query, context);
```

### 4. Vector Search

**VectorDBService:**
```java
// Search in-memory store
List<String> results = vectorStore.search(query, limit);

// Returns relevant documents:
// - Service information
// - Knowledge base entries
// - Appointment details
```

### 5. AI Generation

**GeminiService:**
```java
// Build prompt with context
String prompt = "You are AutoServe AI... Context: [documents] Question: [query]";

// Call Gemini API
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent

// Parse response
return response.text();
```

### 6. Response

```json
{
  "response": "AutoServe offers: Oil Change ($50), Tire Rotation ($30)...",
  "success": true,
  "error": null
}
```

## Data Sync Flow

### When Service is Created

```
Admin creates service
    ↓
ServiceService.createService()
    ↓
MySQL saves service
    ↓
vectorDBService.addService()
    ↓
SimpleVectorStore indexes service
    ↓
Now searchable by chatbot
```

### When Appointment is Booked

```
Customer books appointment
    ↓
AppointmentService.createAppointment()
    ↓
MySQL saves appointment
    ↓
vectorDBService.addAppointment()
    ↓
SimpleVectorStore indexes appointment
    ↓
Now searchable by chatbot
```

## Performance

- Vector search: ~50ms
- Gemini API call: ~500-2000ms
- Total response time: ~600-2500ms

## Error Handling

```
Try to process query
    ↓
If vector search fails → Return empty context
    ↓
If Gemini API fails → Return error message
    ↓
If any exception → Return "technical difficulties" message
```
