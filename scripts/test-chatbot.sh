#!/bin/bash

# Script to test the chatbot endpoint

BASE_URL="http://localhost:8080"

echo "Testing AutoServe Chatbot..."
echo "=============================="
echo ""

# Test 1: What services do you offer?
echo "Test 1: Asking about services"
curl -X POST "$BASE_URL/api/chatbot/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "What services do you offer?"}' \
  -s | jq '.'

echo ""
echo "=============================="
echo ""

# Test 2: How to book an appointment
echo "Test 2: Asking about booking"
curl -X POST "$BASE_URL/api/chatbot/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I book an appointment?"}' \
  -s | jq '.'

echo ""
echo "=============================="
echo ""

# Test 3: Appointment statuses
echo "Test 3: Asking about appointment statuses"
curl -X POST "$BASE_URL/api/chatbot/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the different appointment statuses?"}' \
  -s | jq '.'

echo ""
echo "=============================="
echo ""

echo "Tests completed!"
