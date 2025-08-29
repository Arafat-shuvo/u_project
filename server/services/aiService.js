import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAehPiSlaGCrxeAZmTXbv_IORCEFLWTGoM");

export const askGemini = async ({ question, context, pdfAnswer }) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    PDF Context: """${context}"""
    
    Initial PDF Answer: """${pdfAnswer || "No direct answer found"}"""
    
    User Question: ${question}
    
    Instructions:
    1. If the PDF answer is correct but verbose, summarize it
    2. If the PDF answer is incomplete, enhance it using context
    3. If no answer exists, say "The document doesn't specify"
    4. Respond in 1-2 concise sentences
    5. Maintain original facts exactly
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to get AI response";
  }
};
