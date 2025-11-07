package com.autoserve.service;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Simple in-memory vector store using basic text similarity
 * No external dependencies required - runs entirely in Java
 */
@Component
public class SimpleVectorStore {

    private final Map<String, Document> documents = new ConcurrentHashMap<>();

    public void addDocument(String id, String content, Map<String, Object> metadata) {
        documents.put(id, new Document(id, content, metadata));
    }

    public void updateDocument(String id, String content, Map<String, Object> metadata) {
        documents.put(id, new Document(id, content, metadata));
    }

    public void deleteDocument(String id) {
        documents.remove(id);
    }

    public List<String> search(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String normalizedQuery = query.toLowerCase();
        
        // Calculate similarity scores for all documents
        List<ScoredDocument> scoredDocs = documents.values().stream()
            .map(doc -> new ScoredDocument(doc, calculateSimilarity(normalizedQuery, doc.content)))
            .filter(sd -> sd.score > 0)
            .sorted((a, b) -> Double.compare(b.score, a.score))
            .limit(limit)
            .collect(Collectors.toList());

        return scoredDocs.stream()
            .map(sd -> sd.document.content)
            .collect(Collectors.toList());
    }

    public void clear() {
        documents.clear();
    }

    public int size() {
        return documents.size();
    }

    /**
     * Calculate similarity between query and document using:
     * 1. Keyword matching
     * 2. Word overlap
     * 3. Partial matching
     */
    private double calculateSimilarity(String query, String content) {
        String normalizedContent = content.toLowerCase();
        
        // Exact match gets highest score
        if (normalizedContent.contains(query)) {
            return 1.0;
        }

        // Split into words
        String[] queryWords = query.split("\\s+");
        String[] contentWords = normalizedContent.split("\\s+");
        
        // Calculate word overlap
        Set<String> querySet = new HashSet<>(Arrays.asList(queryWords));
        Set<String> contentSet = new HashSet<>(Arrays.asList(contentWords));
        
        // Remove common stop words
        Set<String> stopWords = new HashSet<>(Arrays.asList(
            "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
            "have", "has", "had", "do", "does", "did", "will", "would", "should",
            "could", "may", "might", "can", "of", "to", "in", "on", "at", "for",
            "with", "about", "as", "by", "from", "up", "down", "out", "over"
        ));
        
        querySet.removeAll(stopWords);
        contentSet.removeAll(stopWords);
        
        if (querySet.isEmpty()) {
            return 0.0;
        }
        
        // Calculate Jaccard similarity
        Set<String> intersection = new HashSet<>(querySet);
        intersection.retainAll(contentSet);
        
        Set<String> union = new HashSet<>(querySet);
        union.addAll(contentSet);
        
        double jaccardScore = union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
        
        // Boost score for partial word matches
        double partialMatchScore = 0.0;
        for (String queryWord : querySet) {
            for (String contentWord : contentSet) {
                if (contentWord.contains(queryWord) || queryWord.contains(contentWord)) {
                    partialMatchScore += 0.5;
                }
            }
        }
        
        return Math.min(1.0, jaccardScore + (partialMatchScore / querySet.size()));
    }

    private static class Document {
        final String id;
        final String content;
        final Map<String, Object> metadata;

        Document(String id, String content, Map<String, Object> metadata) {
            this.id = id;
            this.content = content;
            this.metadata = metadata;
        }
    }

    private static class ScoredDocument {
        final Document document;
        final double score;

        ScoredDocument(Document document, double score) {
            this.document = document;
            this.score = score;
        }
    }
}
