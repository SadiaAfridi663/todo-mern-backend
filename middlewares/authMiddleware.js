const jwt = require('jsonwebtoken');
const Users = require('../models/User');
const jwtSecret = process.env.JWT_SECRET;


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ isSuccess: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwtSecret); // decoded = { user: { id, userName }, iat, exp }
        req.user = decoded.user; // store only user info in req.user
        next();
    } catch (err) {
        return res.status(401).json({ isSuccess:false, message:'Token is not valid' });
    }
};

module.exports = authMiddleware;
