const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      isSuccess: false,
      message: "Not authorized. No token found.",
    });
  }

  console.log("token:", token);

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Attach user info to request
    req.user = decoded.user;

    next();
  } catch (err) {
    return res.status(401).json({
      isSuccess: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;