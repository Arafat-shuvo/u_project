import natural from "natural";
import Pdf from "../modules/Pdf.js";

// 1. Keyword-Based Context Finder
export const answerFromPDF = async (question, pdfId) => {
  const pdf = await Pdf.findById(pdfId);
  const questionKeywords = extractKeywords(question);

  let bestMatch = { score: 0, text: "", page: 1 };

  // Search all chunks
  pdf.chunks.forEach((chunk) => {
    const score = calculateRelevanceScore(chunk, questionKeywords);
    if (score > bestMatch.score) {
      bestMatch = {
        score,
        text: chunk.text,
        page: chunk.pageNumber,
      };
    }
  });

  // Return only if confident match (adjust threshold as needed)
  return bestMatch.score >= 0.6 ? bestMatch : null;
};

// 2. Smart Relevance Scoring
export function calculateRelevanceScore(chunk, keywords) {
  let score = 0;

  // Keyword matches
  keywords.forEach((kw) => {
    if (chunk?.text?.toLowerCase()?.includes(kw)) {
      score += 0.3; // Base score per keyword
    }
  });

  // Proximity boost - questions at start of text score higher
  const firstKeywordPos = Math.min(
    ...keywords
      .map((kw) => chunk.text.toLowerCase().indexOf(kw))
      .filter((p) => p >= 0)
  );

  if (firstKeywordPos >= 0) {
    score += (1 - Math.min(firstKeywordPos / 200, 1)) * 0.7;
  }

  return score;
}

// 3. Dynamic Keyword Extraction
export function extractKeywords(question) {
  const tokenizer = new natural.WordTokenizer();
  const stopwords = new Set([
    "the",
    "and",
    "of",
    "to",
    "a",
    "in",
    "is",
    "it",
    "that",
    "this",
    "for",
    "with",
    "as",
    "on",
    "was",
    "at",
    "by",
    "an",
    "be",
    "are",
    "from",
    "or",
    "not",
    "but",
    "all",
    "if",
    "we",
    "you",
    "they",
    "he",
    "she",
    "my",
    "your",
    "his",
    "her",
    "their",
    "its",
    "there",
    "what",
  ]);

  return (tokenizer.tokenize(question.toLowerCase()) || [])
    .filter((word) => word.length > 3 && !stopwords.has(word))
    .map((word) => natural.PorterStemmer.stem(word));
}
