import { Router } from "express";
import { deleteFile, getPDFs, uploadPDF } from "../controllers/pdfController.js";
import upload from "../utils/fileUpload.js";
const _ = Router();
// POST /api/pdf/upload
_.post("/upload", upload.single("pdf"), uploadPDF);

// GET /api/pdf/list
_.get("/list", getPDFs);

// DELETE /api/pdf/:id

_.delete("/:id", deleteFile);
export default _;
