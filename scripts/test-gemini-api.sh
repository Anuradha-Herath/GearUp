#!/bin/bash

echo "🧪 Testing Gemini API..."
echo ""

API_KEY="AIzaSyC_L2Rhw9kJyWrX767KfDT9GlDMYL9X-eQ"
API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

echo "API Key: ${API_KEY:0:20}..."
echo "API URL: $API_URL"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}?key=${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello in one sentence"
      }]
    }]
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ SUCCESS! Gemini API is working!"
    echo ""
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo "❌ FAILED! Gemini API returned error $HTTP_CODE"
    echo ""
    echo "Error Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
    echo "Possible issues:"
    echo "1. API key is invalid or expired"
    echo "2. API key doesn't have Gemini API enabled"
    echo "3. Quota exceeded"
    echo "4. Model name is wrong"
fi
