const Joi = require("joi");

// Register validation
const registerSchema = Joi.object({
  userName: Joi.string().trim().min(1).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required()
});

module.exports = { registerSchema, loginSchema };