#!/bin/bash

echo "🧪 Testing Chatbot Endpoint..."
echo ""

# Test the endpoint
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8080/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "HTTP Status Code: $HTTP_CODE"
echo ""
echo "Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ SUCCESS! Chatbot endpoint is working!"
    echo ""
    echo "You can now use the chatbot in your frontend."
    echo "Open http://localhost:5173 and click the chat icon!"
else
    echo "❌ FAILED! Got HTTP $HTTP_CODE"
    echo ""
    if [ "$HTTP_CODE" = "403" ]; then
        echo "🚨 403 Forbidden - Backend needs to be restarted!"
        echo ""
        echo "Run this command:"
        echo "  ./scripts/restart-backend.sh"
    elif [ "$HTTP_CODE" = "000" ]; then
        echo "🚨 Cannot connect - Backend is not running!"
        echo ""
        echo "Start the backend:"
        echo "  ./scripts/start-backend.sh"
    else
        echo "Check backend logs for errors."
    fi
fi
