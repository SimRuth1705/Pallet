const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, admin, updateSettings);

module.exports = router;
