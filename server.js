const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cookieParser = require("cookie-parser");
const protect = require("./middlewares/authMiddleware"); 


// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration to allow requests from frontend
app.use(cors({
  origin: "http://localhost:5173",

  credentials: true
}));

// Routes
app.use('/api/v1/todos', protect, todoRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

module.exports = app;