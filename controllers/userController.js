const jwt = require('jsonwebtoken');
const Users = require('../models/User');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;
const jwtExpire = process.env.JWT_EXPIRE || '7d';

const registerUser = async (req, res) => {
  const { userName, email, password,role } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ isSuccess: false, message: 'All fields are required' });
  }

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ isSuccess: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Users.create({
      userName,
      email,
      password: hashedPassword,
      role:"user"
    });

     await newUser.save();
  console.log("Admin created!");

    // ✅ Do NOT generate token here
    return res.status(201).json({
      isSuccess: true,
      message: 'User registered successfully'
    });

  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: 'Server Error',
      error: err.message
    });
  }
};


const loginUser = async (req,res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ isSuccess: false, message:'All fields are required' });
    }

    try {
        const user = await Users.findOne({ email });
        if(!user){
            return res.status(404).json({ isSuccess:false, message:'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ isSuccess:false, message:'Invalid credentials' });
        }

        const payload = { 
          user: {
             id: user._id,
              userName: user.userName,
              role: user.role
             } };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire });

        return res.status(200).json({ isSuccess:true, message:'User logged in successfully', token });
    } catch(err){
        return res.status(500).json({ isSuccess:false, message:'Server Error', error: err.message });
    }
}

module.exports = {registerUser, loginUser}

