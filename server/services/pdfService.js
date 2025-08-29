import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);

    // Force text to always be a string
    const cleanText = String(data.text || '');

    return {
      text: cleanText,
      metadata: {
        pages: data.numpages
      }
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

// Ensure chunks are always strings
export function chunkText(text) {
  const safeText = String(text || '');
  return safeText.match(/.{1,1000}/gs) || []; // ~1000 chars per chunk
}

// Ensure keywords are strings
export function extractKeywords(text, limit = 5) {
  const safeText = String(text || '');
  return safeText
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, limit);
}
