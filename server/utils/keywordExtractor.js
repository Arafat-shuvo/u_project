import natural from "natural";
const { PorterStemmer, WordTokenizer } = natural;
const stopWords = new Set([
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

export function extractKeywords(text, maxKeywords = 5) {
  const tokenizer = new WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());

  return [...new Set(tokens)]
    .filter(
      (token) =>
        token.length > 3 && !stopWords.has(token) && /^[a-z]+$/.test(token) // Letters only
    )
    .map((token) => PorterStemmer.stem(token)) // Stemming
    .slice(0, maxKeywords);
}
