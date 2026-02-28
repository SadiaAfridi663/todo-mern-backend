const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");

const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require("../controllers/todoController");

const {
  createTodoSchema,
  updatedTodoSchema
} = require("../validators/todoValidator");

// GET all todos
router.get("/",  getTodos);

// POST create todo with validation middleware
router.post("/",  validate(createTodoSchema), createTodo);
router.patch('/:id',  validate(updatedTodoSchema), updateTodo);
router.delete("/:id",  deleteTodo)

module.exports = router;
