const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const {registerUser,loginUser} = require('../controllers/userController')
const {
  registerSchema,
  loginSchema
} = require("../validators/userValidator");

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);

module.exports = router;
