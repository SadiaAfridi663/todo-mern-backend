const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db')
const cors = require("cors")
const todo = require("./routes/todoRoutes");
const user = require('./routes/userRoutes')
const adminRoutes = require("./routes/adminRoutes");

const PORT = process.env.PORT || 5000;

// connect to database
connectDB();

// app.use(cors({
//     origin: "http://localhost:5173", // React app URL
//     credentials: true, 
// }));
app.use(express.json());


// connect routes
app.use('/api/v1/todos', todo);
app.use('/api/v1/user', user)

app.use("/api/v1/admin", adminRoutes);



app.listen(PORT, () =>{
    console.log(`server started on port ${PORT} `);
})
