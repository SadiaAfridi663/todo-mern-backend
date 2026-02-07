const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const protect = require("../middlewares/authMiddleware"); 
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
router.get("/", protect, getTodos);

// POST create todo with validation middleware
router.post("/", protect, validate(createTodoSchema), createTodo);
router.patch('/:id', protect, validate(updatedTodoSchema), updateTodo);
router.delete("/:id", protect, deleteTodo)

module.exports = router;
