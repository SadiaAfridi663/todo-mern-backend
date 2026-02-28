const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cookieParser = require("cookie-parser");


// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
// In production, replace '*' with your frontend URL
// app.use(cors({
//     origin: "*",
//     credentials: true
// }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);

// Root route
// app.get('/', (req, res) => {
//     res.send('MERN Todo App API is running!');
// });



// // Export app for Vercel
// module.exports = app;

// Root route
app.get('/', (req, res) => {
    res.send('MERN Todo App API is running!');
});

// Start server locally
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
