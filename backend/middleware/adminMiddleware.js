// Requires strictly Admin role
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Not authorized: Requires Admin privileges' });
  }
};

// Requires Manager or Admin role
exports.manager = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Manager')) {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Not authorized: Requires Admin or Manager privileges' });
  }
};
