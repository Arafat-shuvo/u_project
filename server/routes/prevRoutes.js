import { Router } from "express";
import { deleteFile, getAllFiles, getSingleFile, uploadFile } from "../controllers/prevController.js";
import { multaCloudinary } from "../utils/cloud-multa.js";
const _ = Router();
_.post("/", multaCloudinary.single("prev"), uploadFile);
_.get("/", getAllFiles);
_.get("/:id", getSingleFile);
_.delete("/:id", deleteFile);
export default _;