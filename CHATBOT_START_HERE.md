# 🤖 AutoServe AI Chatbot - START HERE

## ⚡ Quick Start (3 Commands)

```bash
# 1. Start the backend (or restart if already running)
./scripts/start-backend.sh

# 2. Start the frontend (in another terminal)
cd frontend && npm run dev

# 3. Open browser
# Go to http://localhost:5173
# Look for the floating chat icon (bottom-right)! 💬
```

**Note:** If you were running the backend before, **restart it** to apply the security fix!

**Or test without frontend:**
```bash
open docs/chatbot-test.html
```

That's it! No Docker, no setup, just works. ✨

## 📖 Documentation

- **[CHATBOT_FINAL_SUMMARY.md](CHATBOT_FINAL_SUMMARY.md)** ⭐ - Complete overview (start here!)
- **[CHATBOT_TROUBLESHOOTING.md](CHATBOT_TROUBLESHOOTING.md)** 🔧 - Troubleshooting guide (403 fix!)
- **[CHATBOT_FRONTEND_INTEGRATION.md](CHATBOT_FRONTEND_INTEGRATION.md)** 🎨 - Frontend integration guide
- **[CHATBOT_QUICK_REFERENCE.md](CHATBOT_QUICK_REFERENCE.md)** - Quick commands cheat sheet
- **[NO_DOCKER_SETUP.md](NO_DOCKER_SETUP.md)** - Why no Docker is needed
- **[docs/CHATBOT_QUICKSTART.md](docs/CHATBOT_QUICKSTART.md)** - Quick start guide
- **[docs/CHATBOT_SETUP.md](docs/CHATBOT_SETUP.md)** - Detailed setup
- **[docs/CHATBOT_ARCHITECTURE.md](docs/CHATBOT_ARCHITECTURE.md)** - System architecture

## 💬 Try It

Once the backend is running, ask questions like:
- "What services do you offer?"
- "How do I book an appointment?"
- "What are the appointment statuses?"
- "Can I cancel my appointment?"

## 🎯 What You Get

✅ AI-powered chatbot using Google Gemini  
✅ Automatic sync with your MySQL database  
✅ Semantic search (understands meaning, not just keywords)  
✅ Natural language responses  
✅ **NO Docker or external dependencies!**  

## 🔧 How It Works

```
Your Question
    ↓
In-Memory Vector Search (finds relevant info)
    ↓
Gemini AI (generates natural response)
    ↓
Smart Answer
```

All your services and appointments are automatically indexed and searchable!

## 🚀 Next Steps

1. Start the backend: `./scripts/start-backend.sh`
2. Open test interface: `open docs/chatbot-test.html`
3. Ask questions and see it work!
4. Read [CHATBOT_FINAL_SUMMARY.md](CHATBOT_FINAL_SUMMARY.md) for details

---

**Need help?** Check [CHATBOT_FINAL_SUMMARY.md](CHATBOT_FINAL_SUMMARY.md) for troubleshooting and customization.
