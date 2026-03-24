const Offer = require('../models/Offer');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Private/Admin
exports.getOffers = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) query.code = { $regex: search, $options: 'i' };
    if (status && status !== 'All Status') query.status = status;

    const offers = await Offer.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: offers.length, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
exports.createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    // Handle mongoose duplicate key error specifically for unique codes
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'An offer with this code already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'An offer with this code already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    await offer.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
