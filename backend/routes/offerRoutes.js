const express = require('express');
const { getOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, admin, getOffers)
  .post(protect, admin, createOffer);

router.route('/:id')
  .put(protect, admin, updateOffer)
  .delete(protect, admin, deleteOffer);

module.exports = router;
