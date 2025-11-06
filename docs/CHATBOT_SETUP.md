# AutoServe Chatbot Setup Guide

## Overview

The AutoServe chatbot uses a modern RAG (Retrieval-Augmented Generation) architecture combining:
- **ChromaDB** - Local vector database for semantic search
- **Gemini API** - Google's AI for natural language responses
- **MySQL** - Primary database (source of truth)

## Architecture

```
User Query → Java Backend → ChromaDB (semantic search) → Gemini API → Response
                ↓
              MySQL (sync on create/update/delete)
```

## Prerequisites

1. **Docker** - For running ChromaDB locally
2. **Java 17+** - Already configured in your project
3. **Gemini API Key** - Already configured: `AIzaSyC_L2Rhw9kJyWrX767KfDT9GlDMYL9X-eQ`

## Setup Instructions

### 1. Start ChromaDB

Run the provided script to start ChromaDB locally:

```bash
chmod +x scripts/start-chromadb.sh
./scripts/start-chromadb.sh
```

Or manually with Docker:

```bash
docker run -d \
  --name chromadb \
  -p 8000:8000 \
  -v chromadb_data:/chroma/chroma \
  chromadb/chroma:latest
```

Verify ChromaDB is running:
```bash
curl http://localhost:8000/api/v1/heartbeat
```

### 2. Configure Environment Variables

The Gemini API key is already configured in `application.yml`:

```yaml
gemini:
  api:
    key: AIzaSyC_L2Rhw9kJyWrX767KfDT9GlDMYL9X-eQ
    url: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent

chroma:
  host: localhost
  port: 8000
```

### 3. Build and Run the Application

```bash
cd backend
./apache-maven-3.9.9/bin/mvn clean install
./apache-maven-3.9.9/bin/mvn spring-boot:run
```

## How It Works

### Data Synchronization

The system automatically syncs data to ChromaDB when:

1. **Services are created/updated/deleted**
   - `ServiceService` → `VectorDBService.addService()`
   - Stores: title, description, subservices, duration, price

2. **Appointments are created/updated/deleted**
   - `AppointmentService` → `VectorDBService.addAppointment()`
   - Stores: customer, service, vehicle, date, time, status, cost

3. **Knowledge Base** (initialized on startup)
   - How the system works
   - Available features
   - Appointment statuses
   - Business rules

### Query Flow

1. User sends query to `/api/chatbot/query`
2. `ChatbotService` searches ChromaDB for relevant context (top 5 results)
3. Context + query sent to Gemini API
4. Gemini generates natural language response
5. Response returned to user

## API Usage

### Endpoint

```
POST /api/chatbot/query
Content-Type: application/json
```

### Request Body

```json
{
  "query": "What services do you offer?",
  "userId": "optional-user-id"
}
```

### Response

```json
{
  "response": "AutoServe offers various automobile services including...",
  "success": true,
  "error": null
}
```

### Example Queries

- "What services do you offer?"
- "How do I book an appointment?"
- "What are the appointment statuses?"
- "How much does an oil change cost?"
- "Can I cancel my appointment?"
- "What information do I need to book a service?"

## Testing

### Test ChromaDB Connection

```bash
curl http://localhost:8000/api/v1/heartbeat
```

### Test Chatbot Endpoint

```bash
curl -X POST http://localhost:8080/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What services do you offer?"}'
```

## Troubleshooting

### ChromaDB Not Starting

```bash
# Check if port 8000 is already in use
lsof -i :8000

# Stop existing ChromaDB container
docker stop chromadb
docker rm chromadb

# Restart
./scripts/start-chromadb.sh
```

### Gemini API Errors

- Verify API key is correct in `application.yml`
- Check API quota: https://console.cloud.google.com/
- Review logs for detailed error messages

### Vector DB Not Syncing

- Check application logs for ChromaDB connection errors
- Verify ChromaDB is running: `docker ps | grep chromadb`
- Restart the application to reinitialize collections

## Maintenance

### Stop ChromaDB

```bash
docker stop chromadb
```

### Clear ChromaDB Data

```bash
docker stop chromadb
docker rm chromadb
docker volume rm chromadb_data
```

### Update Knowledge Base

Edit the `initializeKnowledgeBase()` method in `VectorDBService.java` and restart the application.

## Production Considerations

1. **ChromaDB Hosting**: Move to a dedicated server or cloud service
2. **API Key Security**: Use environment variables or secrets manager
3. **Rate Limiting**: Implement rate limiting for Gemini API calls
4. **Caching**: Add response caching for common queries
5. **Monitoring**: Track API usage and response times
6. **Backup**: Regular backups of ChromaDB data

## Dependencies Added

```xml
<!-- ChromaDB Client -->
<dependency>
    <groupId>tech.amikos</groupId>
    <artifactId>chromadb-java-client</artifactId>
    <version>0.1.13</version>
</dependency>

<!-- OkHttp for HTTP requests -->
<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>4.12.0</version>
</dependency>

<!-- Gson for JSON parsing -->
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
</dependency>
```

## Files Created/Modified

### New Files
- `config/ChromaDBConfig.java` - ChromaDB client configuration
- `service/VectorDBService.java` - Vector database operations
- `service/GeminiService.java` - Gemini API integration
- `dto/ChatbotResponseDTO.java` - Response structure
- `scripts/start-chromadb.sh` - ChromaDB startup script

### Modified Files
- `pom.xml` - Added dependencies
- `application.yml` - Added Gemini and ChromaDB config
- `service/ChatbotService.java` - Implemented RAG logic
- `service/ServiceService.java` - Added vector DB sync
- `service/AppointmentService.java` - Added vector DB sync
- `controller/ChatbotController.java` - Enhanced endpoint
- `dto/ChatbotQueryDTO.java` - Added userId field
