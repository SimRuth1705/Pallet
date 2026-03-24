const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Total Revenue (Sum of all completed orders)
    const revenueAggr = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAggr.length > 0 ? revenueAggr[0].total : 0;

    // Active Orders Count
    const activeOrders = await Order.countDocuments({ orderStatus: { $in: ['Pending', 'Processing'] } });

    // Total Users
    const totalUsers = await User.countDocuments({ role: 'Customer' });

    // New Users (Created in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ 
      role: 'Customer', 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    // Top Selling Products
    const topProductsAggr = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $unwind: '$items' },
      { $group: { 
          _id: '$items.product', 
          name: { $first: '$items.name' },
          totalSales: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 4 }
    ]);

    // Populate current stock for top products
    const topProducts = await Product.populate(topProductsAggr, { path: '_id', select: 'category stock status' });
    
    // Format the response to exactly match AdminDashboard.jsx expectation
    const formattedTopProducts = topProducts.map(p => ({
       id: p._id._id,
       name: p.name,
       category: p._id.category,
       sales: p.totalSales,
       revenue: `$${p.totalRevenue.toLocaleString()}`,
       stock: p._id.stock > 10 ? 'In Stock' : (p._id.stock > 0 ? 'Low Stock' : 'Out of Stock')
    }));

    // Recent Activity Log (Combine latest users and orders)
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(3).populate('customer', 'name');
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(2);
    
    const recentActivity = [
      ...recentOrders.map(o => ({
        id: `ord-${o._id}`,
        type: 'order',
        title: `New Order #${o._id.toString().substring(0, 8)}`,
        desc: `${o.customerName} bought items worth $${o.totalAmount}`,
        time: o.createdAt,
        color: 'text-emerald-500', 
        bg: 'bg-emerald-50'
      })),
      ...recentUsers.map(u => ({
        id: `usr-${u._id}`,
        type: 'user',
        title: 'New Account',
        desc: `${u.name} joined the platform`,
        time: u.createdAt,
        color: 'text-blue-500', 
        bg: 'bg-blue-50'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalRevenue: `$${totalRevenue.toLocaleString()}`,
          activeOrders,
          newUsers,
          engagementRate: "92.4%", // Mocked metric
        },
        topProducts: formattedTopProducts,
        recentActivity
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving dashboard stats' });
  }
};
