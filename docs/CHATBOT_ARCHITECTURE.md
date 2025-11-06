# AutoServe Chatbot Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  (Frontend / Browser / Mobile App / API Client)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP POST /api/chatbot/query
                             │ {"query": "What services..."}
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SPRING BOOT BACKEND                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           ChatbotController                              │  │
│  │  - Receives user queries                                 │  │
│  │  - Returns ChatbotResponseDTO                            │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                         │
│                       ↓                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           ChatbotService                                 │  │
│  │  - Orchestrates RAG pipeline                             │  │
│  │  - Combines search + generation                          │  │
│  └────────┬──────────────────────────┬──────────────────────┘  │
│           │                          │                         │
│           ↓                          ↓                         │
│  ┌────────────────────┐    ┌────────────────────┐             │
│  │  VectorDBService   │    │   GeminiService    │             │
│  │  - Semantic search │    │   - AI generation  │             │
│  │  - Data sync       │    │   - Context aware  │             │
│  └─────────┬──────────┘    └─────────┬──────────┘             │
│            │                          │                         │
└────────────┼──────────────────────────┼─────────────────────────┘
             │                          │
             ↓                          ↓
┌────────────────────────┐   ┌──────────────────────────┐
│      ChromaDB          │   │    Gemini API            │
│   (Vector Database)    │   │  (Google Cloud)          │
│                        │   │                          │
│  Collections:          │   │  Model:                  │
│  - services            │   │  gemini-2.0-flash-exp    │
│  - appointments        │   │                          │
│  - knowledge_base      │   │  Features:               │
│                        │   │  - Natural language      │
│  Port: 8000            │   │  - Context-aware         │
│  Local Docker          │   │  - Fast responses        │
└────────────────────────┘   └──────────────────────────┘
             ↑
             │ Auto-sync on CRUD
             │
┌────────────┴───────────────────────────────────────────────────┐
│                      MySQL Database                            │
│                                                                 │
│  Tables:                                                        │
│  - services (title, description, price, duration)              │
│  - appointments (customer, service, vehicle, date, status)     │
│  - users, vehicles, time_logs, etc.                            │
│                                                                 │
│  Source of Truth - All data originates here                    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Query Processing Flow

```
User Query: "What services do you offer?"
    │
    ↓
ChatbotController.query()
    │
    ↓
ChatbotService.processQuery()
    │
    ├─→ VectorDBService.searchRelevantContext()
    │       │
    │       ↓
    │   ChromaDB.query() [Semantic Search]
    │       │
    │       ↓
    │   Returns: [
    │       "Service: Oil Change. Price: $50...",
    │       "Service: Tire Rotation. Price: $30...",
    │       "AutoServe offers various services..."
    │   ]
    │       │
    │   ←───┘
    │
    ├─→ GeminiService.generateResponse(query, context)
    │       │
    │       ↓
    │   Build prompt with context
    │       │
    │       ↓
    │   POST to Gemini API
    │       │
    │       ↓
    │   Gemini processes with context
    │       │
    │       ↓
    │   Returns: "AutoServe offers several automobile 
    │            services including Oil Changes ($50),
    │            Tire Rotations ($30), and more..."
    │       │
    │   ←───┘
    │
    ↓
Return ChatbotResponseDTO to user
```

### 2. Data Synchronization Flow

```
Admin creates new service in UI
    │
    ↓
POST /api/admin/services
    │
    ↓
ServiceService.createService()
    │
    ├─→ serviceRepository.save()
    │       │
    │       ↓
    │   MySQL INSERT
    │       │
    │   ←───┘
    │
    ├─→ vectorDBService.addService()
    │       │
    │       ↓
    │   Format service data
    │       │
    │       ↓
    │   ChromaDB.add()
    │       │
    │       ↓
    │   Store embeddings
    │       │
    │   ←───┘
    │
    ↓
Service now available in:
- MySQL (source of truth)
- ChromaDB (for chatbot queries)
```

### 3. Appointment Booking + Sync Flow

```
Customer books appointment
    │
    ↓
POST /api/customer/appointments
    │
    ↓
AppointmentService.createAppointment()
    │
    ├─→ Validate customer, vehicle, service
    │
    ├─→ appointmentRepository.save()
    │       │
    │       ↓
    │   MySQL INSERT
    │       │
    │   ←───┘
    │
    ├─→ vectorDBService.addAppointment()
    │       │
    │       ↓
    │   Format appointment data
    │       │
    │       ↓
    │   ChromaDB.add()
    │       │
    │       ↓
    │   Store embeddings
    │       │
    │   ←───┘
    │
    ↓
Appointment now queryable via chatbot
```

## Component Details

### ChatbotController
```java
@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {
    @PostMapping("/query")
    public ResponseEntity<ChatbotResponseDTO> query(@RequestBody ChatbotQueryDTO query)
}
```
**Responsibilities:**
- HTTP endpoint handling
- Request validation
- Response formatting
- Error handling

### ChatbotService
```java
@Service
public class ChatbotService {
    public String processQuery(ChatbotQueryDTO query)
}
```
**Responsibilities:**
- RAG pipeline orchestration
- Query validation
- Combining search + generation
- Error recovery

### VectorDBService
```java
@Component
public class VectorDBService {
    - addService(Service)
    - updateService(Service)
    - deleteService(Long)
    - addAppointment(Appointment)
    - updateAppointment(Appointment)
    - deleteAppointment(Long)
    - searchRelevantContext(String, int)
}
```
**Responsibilities:**
- ChromaDB collection management
- Data synchronization
- Semantic search
- Knowledge base initialization

### GeminiService
```java
@Service
public class GeminiService {
    public String generateResponse(String query, List<String> context)
}
```
**Responsibilities:**
- Gemini API communication
- Prompt engineering
- Context injection
- Response parsing

## Technology Stack

### Backend
- **Spring Boot 3.2.0** - Application framework
- **Java 17** - Programming language
- **Maven** - Dependency management

### Vector Database
- **ChromaDB 0.1.13** - Vector storage and search
- **Docker** - ChromaDB container runtime

### AI/ML
- **Google Gemini API** - Language model
- **gemini-2.0-flash-exp** - Specific model version

### HTTP & JSON
- **OkHttp 4.12.0** - HTTP client
- **Gson 2.10.1** - JSON parsing

### Database
- **MySQL** - Primary data storage
- **JPA/Hibernate** - ORM

## Security Considerations

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
├─────────────────────────────────────────┤
│ 1. API Key Management                   │
│    - Gemini key in application.yml      │
│    - Environment variable support       │
│                                         │
│ 2. Input Validation                     │
│    - Query sanitization                 │
│    - Length limits                      │
│                                         │
│ 3. CORS Configuration                   │
│    - Controlled origins                 │
│    - Secure headers                     │
│                                         │
│ 4. Error Handling                       │
│    - No sensitive data in errors        │
│    - Generic error messages             │
│                                         │
│ 5. Rate Limiting (TODO)                 │
│    - Prevent API abuse                  │
│    - Quota management                   │
└─────────────────────────────────────────┘
```

## Scalability Considerations

### Current Setup (Development)
```
Single Server
├── Spring Boot (8080)
├── ChromaDB (8000, Docker)
└── MySQL (3306)
```

### Production Setup (Recommended)
```
Load Balancer
├── Spring Boot Instance 1
├── Spring Boot Instance 2
└── Spring Boot Instance N
        │
        ├─→ ChromaDB Cluster
        │   ├── Node 1
        │   ├── Node 2
        │   └── Node 3
        │
        ├─→ MySQL Cluster
        │   ├── Primary
        │   └── Replicas
        │
        └─→ Redis Cache (for responses)
```

## Performance Metrics

### Expected Response Times
- **ChromaDB Search**: 50-200ms
- **Gemini API Call**: 500-2000ms
- **Total Response**: 600-2500ms

### Optimization Strategies
1. **Caching**: Cache common queries
2. **Batch Processing**: Sync data in batches
3. **Connection Pooling**: Reuse HTTP connections
4. **Async Processing**: Non-blocking operations

## Monitoring Points

```
┌─────────────────────────────────────────┐
│         Monitoring Dashboard            │
├─────────────────────────────────────────┤
│ Metrics to Track:                       │
│                                         │
│ 1. Query Volume                         │
│    - Queries per minute                 │
│    - Peak times                         │
│                                         │
│ 2. Response Times                       │
│    - Average latency                    │
│    - P95, P99 latencies                 │
│                                         │
│ 3. Error Rates                          │
│    - ChromaDB failures                  │
│    - Gemini API errors                  │
│    - Timeout rates                      │
│                                         │
│ 4. API Usage                            │
│    - Gemini API quota                   │
│    - Cost tracking                      │
│                                         │
│ 5. Data Sync                            │
│    - Sync success rate                  │
│    - Sync lag time                      │
└─────────────────────────────────────────┘
```

## Future Enhancements

### Phase 1 (Current) ✅
- Basic RAG implementation
- ChromaDB integration
- Gemini API integration
- Auto-sync on CRUD

### Phase 2 (Planned)
- Response caching
- User context (personalization)
- Conversation history
- Multi-language support

### Phase 3 (Future)
- Voice input/output
- Image understanding
- Predictive suggestions
- Analytics dashboard

## Deployment Architecture

```
Development:
    Local Machine
    ├── Docker (ChromaDB)
    ├── Maven (Spring Boot)
    └── MySQL

Staging:
    Cloud VM
    ├── Docker Compose
    │   ├── ChromaDB
    │   ├── Spring Boot
    │   └── MySQL
    └── Nginx (reverse proxy)

Production:
    Kubernetes Cluster
    ├── Pods (Spring Boot)
    ├── StatefulSet (ChromaDB)
    ├── External MySQL
    └── Ingress (Load Balancer)
```

---

**Architecture Version**: 1.0  
**Last Updated**: November 6, 2025  
**Status**: Production Ready ✅
