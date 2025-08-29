import { extractKeywords } from "../utils/keywordExtractor.js";
import { chunkText } from "../utils/chunkText.js";
import Pdf from "../modules/Pdf.js";

import { extractTextFromPDF } from "../services/pdfService.js";

export const uploadPDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const pdfBuffer = req.file.buffer;

    // 1. Extract text from PDF (guaranteed string now)
    const { text, metadata } = await extractTextFromPDF(pdfBuffer);

    // 2. Split into chunks with page numbers & keywords (all guaranteed strings)
    const chunks = chunkText(text).map((chunk, index) => ({
      text: String(chunk), // force string
      pageNumber: metadata.pageNumbers?.[index] || 1,
      keywords: extractKeywords(chunk, 5).map(String), // force array of strings
      embedding: [], // optional: blank array for vector search
    }));

    // 3. Save to database
    const savedPdf = await Pdf.create({
      filename: req.file.filename || req.file.originalname,
      originalName: req.file.originalname,
      text: String(text),
      chunks,
      user: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      pdfId: savedPdf._id,
      chunksCount: chunks.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getPDFs = async (req, res, next) => {
  try {
    const pdfs = await Pdf.find() 
      .select("filename originalName uploadDate")
      .sort({ uploadDate: -1 });

    res.json(pdfs);
  } catch (error) {
    next(error);
  }
};


// 📌Delete file
export const deleteFile = async (req, res) => { 
  try {
    const file = await Pdf.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

   

    // Remove from DB
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete file", error: error.message });
  }
}
