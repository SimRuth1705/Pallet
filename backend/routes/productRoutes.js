const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { manager } = require('../middleware/adminMiddleware');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, manager, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, manager, updateProduct)
  .delete(protect, manager, deleteProduct);

module.exports = router;
