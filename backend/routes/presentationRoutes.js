const express = require('express');
const router = express.Router();

const {
  createPresentation,
  getHistory,
  getFavourites
} = require('../controllers/presentationController');

router.post('/new', createPresentation);
router.get('/history', getHistory);
router.get('/favourites', getFavourites);

module.exports = router;