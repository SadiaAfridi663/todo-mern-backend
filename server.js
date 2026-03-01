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

const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration to allow credentialed requests from frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://todo-mern-frontend-green.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients/tools and configured browser origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS: origin not allowed"));
    },
    credentials: true,
  })
);

// Routes
app.use('/api/v1/todos', protect, todoRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Todo API');
});


module.exports = app;
