const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// CORS
// In production, replace '*' with your frontend URL
app.use(cors({
    origin: "*",
    credentials: true
}));

// Routes
app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('MERN Todo App API is running!');
});

// Export app for Vercel
module.exports = app;
