const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Clothing', 'Accessories', 'Footwear', 'Electronics', 'Furniture', 'Other']
  },
  stock: {
    type: Number,
    required: [true, 'Please define current stock value'],
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Low Stock', 'Out of Stock'],
    default: 'Active'
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
