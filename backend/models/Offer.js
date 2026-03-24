const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add an offer code'],
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['Percentage', 'Fixed Amount'],
    required: true
  },
  value: {
    type: Number,
    required: [true, 'Please define discount value']
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  limit: {
    type: Number,
    required: true,
    default: 100
  },
  usage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Scheduled', 'Expired'],
    default: 'Active'
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);
