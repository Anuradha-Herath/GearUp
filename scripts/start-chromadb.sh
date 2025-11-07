#!/bin/bash

# Script to start ChromaDB locally using Docker

echo "Starting ChromaDB locally..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Check if ChromaDB container already exists
if [ "$(docker ps -aq -f name=chromadb)" ]; then
    echo "ChromaDB container already exists. Starting it..."
    docker start chromadb
else
    echo "Creating and starting new ChromaDB container..."
    docker run -d \
        --name chromadb \
        -p 8000:8000 \
        -v chromadb_data:/chroma/chroma \
        chromadb/chroma:latest
fi

echo "ChromaDB is running on http://localhost:8000"
echo "To stop ChromaDB, run: docker stop chromadb"
echo "To remove ChromaDB, run: docker rm chromadb"
