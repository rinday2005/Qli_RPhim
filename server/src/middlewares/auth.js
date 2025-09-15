import jwt from 'jsonwebtoken';

// Middleware xác thực token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Middleware chỉ superadmin mới truy cập được
const verifySuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { verifyToken, verifySuperAdmin };
