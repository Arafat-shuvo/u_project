import { Router } from "express";
import { answerFromPDF } from "../controllers/qaController.js";
import { askGemini } from "../services/aiService.js";
const _ = Router();

// _.post("/ask", async (req, res) => {
//   try {
//     const { question, pdfId } = req.body;

//     const rawPDFAnswer = await answerFromPDF(question, pdfId);

//     if (rawPDFAnswer) {
//       const formattedAnswer = {
//         answer: formatAnswerText(rawPDFAnswer.text, question),
//         page: rawPDFAnswer.pageNumber,
//         confidence: rawPDFAnswer.score.toFixed(2),
//         source: "pdf",
//         fullText: rawPDFAnswer.text,
//       };

//       return res.json({
//         success: true,
//         data: formattedAnswer,
//       });
//  

   
//   } catch (error) {
//     console.error("Q&A Error:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to process question",
//     });
//   }
// });

// Helper: Clean up answer text

_.post("/ask", async (req, res) => {
  try {
    const { question, pdfId } = req.body;

    // 1. Always get PDF answer first (for context)
    const pdfAnswer = await answerFromPDF(question, pdfId);

    // 2. Forward to Gemini with PDF context for refinement
    const geminiResponse = await askGemini({
      question,
      context: pdfAnswer?.fullText || "No PDF context",
      pdfAnswer: pdfAnswer?.text 
    });

    // 3. Format final response
    res.json({
      success: true,
      data: {
        answer: geminiResponse,
        confidence: pdfAnswer ? 0.9 : 0.8, // Higher if PDF context exists
        source: pdfAnswer ? "pdf+gemini" : "gemini",
        pdfPage: pdfAnswer?.pageNumber,
        rawPDFAnswer: pdfAnswer?.text // For debugging
      }
    });

  } catch (error) {
    console.error("Q&A Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process question",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
function formatAnswerText(text, question) {
  // 1. Remove excessive whitespace
  let cleaned = text.replace(/\s+/g, " ").trim();

  // 2. Extract most relevant sentence for fact questions
  if (isFactQuestion(question)) {
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    cleaned = sentences[0]; // Take first complete sentence
  }

  // 3. Trim to reasonable length
  return cleaned.length > 300 ? cleaned.substring(0, 300) + "..." : cleaned;
}

// Helper: Detect fact-based questions
function isFactQuestion(question) {
  return /^(what|where|when|who|which)\b/i.test(question);
}


export default _;
