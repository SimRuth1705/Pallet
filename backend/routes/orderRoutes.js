const express = require('express');
const { getOrders, getOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { manager } = require('../middleware/adminMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, manager, getOrders);

router.route('/:id')
  .get(protect, manager, getOrder)
  .put(protect, manager, updateOrder)
  .delete(protect, manager, deleteOrder);

module.exports = router;
