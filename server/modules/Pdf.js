import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      
    },
    chunks: [
      {
        text: {
          type: String,
          required: true,
        },
        pageNumber: {
          type: Number,
          required: true,
        },
        keywords: {
          type: [String],
          default: [],
        },
        embedding: {
          // Optional: For vector search
          type: [Number],
          select: false,
        },
      },
    ],
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Text search across both
pdfSchema.index({
  "chunks.text": "text",
  "chunks.keywords": "text",
});

// Optional: For vector search (if using Pinecone/Weaviate)
pdfSchema.index({ "chunks.embedding": "2dsphere" });

const Pdf = mongoose.model("Pdf", pdfSchema);

export default Pdf;
