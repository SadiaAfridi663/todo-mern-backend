const Users = require("../models/User");
const bcrypt = require("bcrypt");

const createAdmin = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      isSuccess: false,
      message: "All fields are required"
    });
  }

  try {
    // Check if email already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        isSuccess: false,
        message: "User already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const newAdmin = new Users({
      userName,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await newAdmin.save();

    return res.status(201).json({
      isSuccess: true,
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        userName: newAdmin.userName,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      isSuccess: false,
      message: "Server Error",
      error: err.message
    });
  }
};

module.exports = {createAdmin} 
