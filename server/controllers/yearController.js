import { Year } from "../modules/Previous.js";


// 📌 Create new Year entry
export const createYear = async (req, res) => {
  try {
    const { year, youtubeLink } = req.body;
    
    if (!year || !youtubeLink) {
      return res.status(400).json({ message: "Year and YouTube link are required" });
    }

    // Check if year already exists
    const existing = await Year.findOne({ year,youtubeLink });
    if (existing) {
      return res.status(400).json({ message: "Year already exists" });
    }

    const newYear = new Year({ year, youtubeLink });
    await newYear.save();

    res.status(201).json(newYear);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create year", error: error.message });
  }
};

// 📌 Get all Year entries
export const getAllYears = async (req, res) => {
  try {
    const years = await Year.find().sort({ year: 1 }); // sorted ascending
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch years", error: error.message });
  }
};

// 📌 Get single Year by ID
export const getYearById = async (req, res) => {
  try {
    const year = await Year.findById(req.params.id);
    if (!year) return res.status(404).json({ message: "Year not found" });
    res.json(year);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch year", error: error.message });
  }
};

// 📌 Delete Year by ID
export const deleteYear = async (req, res) => {
  try {
    const year = await Year.findById(req.params.id);
    if (!year) return res.status(404).json({ message: "Year not found" });

    await year.deleteOne();
    res.json({ message: "Year deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete year", error: error.message });
  }
};
