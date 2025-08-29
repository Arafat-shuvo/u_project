import express from "express";
import {
  createYear,
  getAllYears,
  getYearById,
  deleteYear,
} from "../controllers/yearController.js";

const _ = express.Router();

_.post("/", createYear);        // Create new year entry
_.get("/", getAllYears);        // Get all year entries
_.get("/:id", getYearById);     // Get single year by ID
_.delete("/:id", deleteYear);   // Delete year by ID

export default _;
