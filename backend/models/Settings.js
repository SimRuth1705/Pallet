const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: [true, 'Please add a store name'],
    default: 'Pallet E-Store'
  },
  supportEmail: {
    type: String,
    required: [true, 'Please add a support email'],
    default: 'support@pallet.com'
  },
  supportPhone: {
    type: String,
    default: '+1 (555) 000-0000'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  taxRate: {
    type: Number,
    default: 8.5
  },
  shippingFee: {
    type: Number,
    default: 15.00
  },
  logoUrl: {
    type: String,
    default: 'https://via.placeholder.com/200x60?text=PALLET'
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
