const Todo = require("../models/Todo");
const mongoose = require("mongoose");

// GET todos (user sees own todos, admin can see all)
exports.getTodos = async (req, res) => {
  try {
    let todos;

    if (req.user.role === "admin") {
      todos = await Todo.find().sort({ createdAt: -1 });
    } else {
      todos = await Todo.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    }

    if (!todos.length) {
  return res.status(200).json({ 
    isSuccess: true, 
    todos: [], 
    message: "No todos found" 
  });
}


    res.status(200).json({ isSuccess: true, todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, message: "Failed to fetch todos", error: err.message });
  }
};

// CREATE todo
exports.createTodo = async (req, res) => {
  try {
    const newTodo = await Todo.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({ isSuccess: true, message: "Todo created successfully", newTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, message: "Failed to create todo", error: err.message });
  }
};

// UPDATE todo
exports.updateTodo = async (req, res) => {
  const todoId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    return res.status(400).json({ isSuccess: false, message: "Invalid todo ID" });
  }

  try {
    // Normal user: only their own, admin: any
    const filter = req.user.role === "admin" ? { _id: todoId } : { _id: todoId, createdBy: req.user.id };

    const updatedTodo = await Todo.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedTodo) {
      return res.status(404).json({ isSuccess: false, message: "Todo not found or not authorized" });
    }

    res.status(200).json({ isSuccess: true, message: "Todo updated successfully", todo: updatedTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, message: "Failed to update todo", error: err.message });
  }
};

// DELETE todo
exports.deleteTodo = async (req, res) => {
  const todoId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    return res.status(400).json({ isSuccess: false, message: "Invalid ID" });
  }

  try {
    // Normal user: only their own, admin: any
    const filter = req.user.role === "admin" ? { _id: todoId } : { _id: todoId, createdBy: req.user.id };

    const deletedTodo = await Todo.findOneAndDelete(filter);

    if (!deletedTodo) {
      return res.status(404).json({ isSuccess: false, message: "Todo not found or not authorized" });
    }

    res.status(200).json({ isSuccess: true, message: "Todo deleted successfully", todo: deletedTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, message: "Failed to delete todo", error: err.message });
  }
};
