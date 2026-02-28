const jwt = require('jsonwebtoken');
const Users = require('../models/User');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;
const jwtExpire = process.env.JWT_EXPIRE || '7d';
const cloudinary = require("../config/cloudinary");




const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      isSuccess: false,
      message: "All fields are required",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      isSuccess: false,
      message: "Profile image is required",
    });
  }

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        isSuccess: false,
        message: "User already exists",
      });
    }

    // 🔹 Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "profile_pictures",
      }
    );

    // 🔹 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔹 Create user
    const newUser = await Users.create({
      userName,
      email,
      password: hashedPassword,
      role: "user",
      profileImage: uploadResult.secure_url,
    });

    return res.status(201).json({
      isSuccess: true,
      message: "User registered successfully",
    });

  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Server Error",
      error: err.message,
    });
  }
};




// const registerUser = async (req, res) => {
//   const { userName, email, password,role } = req.body;

//   if (!userName || !email || !password) {
//     return res.status(400).json({ isSuccess: false, message: 'All fields are required' });
//   }

  

//   try {
//     const existingUser = await Users.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ isSuccess: false, message: 'User already exists' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = await Users.create({
//       userName,
//       email,
//       password: hashedPassword,
//       role:"user"
//     });

//      await newUser.save();
//   console.log("Admin created!");

//     // ✅ Do NOT generate token here
//     return res.status(201).json({
//       isSuccess: true,
//       message: 'User registered successfully'
//     });

//   } catch (err) {
//     return res.status(500).json({
//       isSuccess: false,
//       message: 'Server Error',
//       error: err.message
//     });
//   }
// };


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      isSuccess: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid credentials",
      });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpire,
    });

    // 🔥 Set cookie instead of returning token
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (https)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      isSuccess: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });

  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ isSuccess: false, message: "User not found" });
    }
    return res.status(200).json({ isSuccess: true, user });
  } catch (err) {
    return res.status(500).json({ isSuccess: false, message: "Server error", error: err.message });
  }
};


const logoutUser = async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // expire immediately
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({ isSuccess: true, message: "Logged out successfully" });
};
module.exports = {registerUser, loginUser, getMe, logoutUser};

