const express = require('express');
const { getOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');
const { admin, manager } = require('../middleware/adminMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, manager, getOffers)
  .post(protect, manager, createOffer);

router.route('/:id')
  .put(protect, manager, updateOffer)
  .delete(protect, manager, deleteOffer);

module.exports = router;
