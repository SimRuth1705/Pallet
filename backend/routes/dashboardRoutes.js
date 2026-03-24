const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { manager } = require('../middleware/adminMiddleware');

const router = express.Router();

router.route('/stats').get(protect, manager, getDashboardStats);

module.exports = router;
