# 🔧 Chatbot Troubleshooting Guide

## ✅ Fixed: 403 Forbidden Error

### Problem
```
POST http://localhost:8080/api/chatbot/query 403 (Forbidden)
```

### Solution
Added chatbot endpoint to Spring Security's permitAll list in `SecurityConfig.java`:

```java
.requestMatchers("/api/chatbot/**").permitAll() // Allow chatbot access for all users
```

### What This Means
- The chatbot endpoint is now **publicly accessible**
- No authentication required to use the chatbot
- Anyone can ask questions (perfect for a help assistant!)

## 🔄 How to Apply the Fix

### Option 1: Restart Backend (Recommended)
```bash
# Stop the current backend (Ctrl+C)
# Then restart:
./scripts/start-backend.sh
```

### Option 2: Manual Restart
```bash
cd backend
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
mvn clean spring-boot:run -DskipTests
```

## ✅ Verify It's Working

### 1. Check Backend Logs
Look for:
```
✅ Vector database initialized successfully (in-memory mode)
✅ Knowledge base initialized with 10 documents
```

### 2. Test with curl
```bash
curl -X POST http://localhost:8080/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

Should return:
```json
{
  "response": "...",
  "success": true,
  "error": null
}
```

### 3. Test in Frontend
1. Open `http://localhost:5173`
2. Click the floating chat icon (bottom-right)
3. Type a message and send
4. Should get a response!

## 🐛 Common Issues & Solutions

### Issue 1: Still Getting 403
**Cause:** Backend not restarted  
**Solution:** Stop and restart the backend completely

### Issue 2: CORS Error
**Cause:** Frontend running on different port  
**Solution:** Already configured to allow `localhost:*` - should work!

### Issue 3: "Failed to get response"
**Cause:** Backend not running  
**Solution:** 
```bash
# Check if backend is running
lsof -i :8080

# If not, start it
./scripts/start-backend.sh
```

### Issue 4: Empty Response
**Cause:** Gemini API issue  
**Solution:** Check backend logs for Gemini API errors

### Issue 5: Chat Icon Not Showing
**Cause:** Frontend not updated  
**Solution:**
```bash
cd frontend
npm run dev
# Hard refresh browser (Cmd+Shift+R on Mac)
```

## 🔍 Debug Checklist

- [ ] Backend is running on port 8080
- [ ] Frontend is running on port 5173
- [ ] Browser console shows no errors
- [ ] Backend logs show vector DB initialized
- [ ] SecurityConfig.java has chatbot permitAll
- [ ] Backend was restarted after config change

## 📊 Expected Flow

```
User clicks chat icon
    ↓
Types message and sends
    ↓
Frontend: POST /api/chatbot/query
    ↓
Spring Security: ✅ Allowed (permitAll)
    ↓
ChatbotController receives request
    ↓
ChatbotService processes query
    ↓
VectorDBService searches for context
    ↓
GeminiService generates response
    ↓
Response sent back to frontend
    ↓
User sees AI response in chat!
```

## 🎯 Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:8080/actuator/health
```

### Test Chatbot Endpoint
```bash
curl -X POST http://localhost:8080/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What services do you offer?"}'
```

### Check Backend Logs
```bash
tail -f backend.log
```

### Check Frontend Console
Open browser DevTools (F12) → Console tab

## 🔐 Security Note

The chatbot endpoint is **intentionally public** because:
- It's a help/support feature
- No sensitive data is exposed
- Responses are based on public service information
- Makes it accessible to all users (logged in or not)

If you want to restrict it to authenticated users only, change:
```java
.requestMatchers("/api/chatbot/**").permitAll()
```
To:
```java
.requestMatchers("/api/chatbot/**").authenticated()
```

But this means users must be logged in to use the chatbot.

## ✨ Success Indicators

When everything is working:
1. ✅ No 403 errors in browser console
2. ✅ Chat icon visible in bottom-right
3. ✅ Messages send and receive responses
4. ✅ Backend logs show "Found X relevant documents"
5. ✅ Responses are intelligent and contextual

## 🆘 Still Having Issues?

1. **Check all logs** (backend + browser console)
2. **Verify ports** (8080 for backend, 5173 for frontend)
3. **Restart everything** (backend + frontend + browser)
4. **Clear browser cache** (Cmd+Shift+R)
5. **Check firewall** (allow ports 8080 and 5173)

## 📝 Testing Checklist

After restart, test these:

- [ ] Backend starts without errors
- [ ] Vector DB initializes (check logs)
- [ ] Frontend loads without errors
- [ ] Chat icon appears
- [ ] Can open chat window
- [ ] Can send message
- [ ] Receives response
- [ ] Response is relevant
- [ ] No console errors

## 🎉 When It Works

You should see:
- Beautiful chat icon in bottom-right corner
- Smooth animations when opening chat
- Quick suggestion chips
- AI-powered responses
- No errors in console
- Happy users! 😊

---

**The fix is applied! Just restart your backend and you're good to go!** 🚀
