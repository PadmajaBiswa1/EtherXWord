const Presentation = require('../models/Presentation');

// Create new presentation
const createPresentation = async (req, res) => {
  try {
    const { title } = req.body;

    const presentation = await Presentation.create({ title });

    res.status(201).json(presentation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all history
const getHistory = async (req, res) => {
  try {
    const data = await Presentation.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get favourites
const getFavourites = async (req, res) => {
  try {
    const data = await Presentation.find({ favourite: true });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPresentation,
  getHistory,
  getFavourites
};