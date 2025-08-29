import fs from "fs";
import {Previous} from "../modules/Previous.js";
import cloudinary from "../config/cloudinary.js";

const options = {
  use_filename: true,
  unique_filename: true,
  overwrite: true,
};
// 📌 Upload file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, options);

    // Save to DB
    const newFile = new Previous({
      filename: req.body.name,
      url: result.secure_url,
      public_id: result.public_id,
    });

    await newFile.save();

    // Remove temp file
    fs.unlinkSync(req.file.path);

    res.status(201).json(newFile);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// 📌 Get all files
export const getAllFiles = async (req, res) => {
  try {
    const files = await Previous.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

// 📌 Get single file
export const getSingleFile = async (req, res) => {
  try {
    const file = await Previous.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch file" });
  }
};

// 📌 Delete file
export const deleteFile = async (req, res) => {
  try {
    const file = await Previous.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

  

    // Remove from cloudinary
    await cloudinary.uploader.destroy(file.public_id,options);

    // Remove from DB
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete file" });
  }
};
