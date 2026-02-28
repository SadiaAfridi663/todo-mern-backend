const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const {registerUser,loginUser, getMe, logoutUser} = require('../controllers/userController')
const upload = require("../middlewares/upload");
const protect = require("../middlewares/authMiddleware"); 
const {
  registerSchema,
  loginSchema
} = require("../validators/userValidator");


router.post("/register",upload.single("profileImage"), validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", protect, logoutUser);
// Protected route to get current user
router.get("/me", protect, getMe);


module.exports = router;
