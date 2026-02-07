const Joi = require("joi");

// POST
const createTodoSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  desc: Joi.string().trim().min(3).required()
});

// PATCH
const updatedTodoSchema = Joi.object({
  title: Joi.string().trim().min(1),
  desc: Joi.string().trim().min(3)
}).min(1); // must update at least one field





module.exports = {
  createTodoSchema,
  updatedTodoSchema,

};