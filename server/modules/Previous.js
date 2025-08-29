import mongoose from "mongoose";

const previousSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  public_id: { type: String, required: true },
}, { timestamps: true });

const yearSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  youtubeLink: { type: String, required: true },
}, { timestamps: true });

export const Previous = mongoose.model("Previous", previousSchema);
export const Year = mongoose.model("Year", yearSchema);

