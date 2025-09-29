const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const todos = [];

exports.create = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { text } = req.body;
  const userId = req.user.id;
  const newTodo = {
    id: uuidv4(),
    text,
    userId,
    createdAt: Date.now(),
    updatedAt: null,
    deleted: false,
  };
  todos.push(newTodo);
  res.status(201).json({ message: "Todo created", todo: newTodo });
};

exports.read = (req, res) => {
  const user = req.user;
  if (user.role === "admin") {
    return res.json(todos);
  }
  res.json(todos.filter((todo) => todo.userId === user.id && !todo.deleted));
};

exports.update = (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  if (user.role !== "admin" && todo.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  Object.assign(todo, req.body, { updatedAt: Date.now() });
  res.json({ message: "Todo updated", todo });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  if (user.role !== "admin" && todo.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  todo.deleted = true;
  res.json({ message: "Todo deleted" });
};

exports.restore = (req, res) => {
  const { id } = req.params;
  const user = req.user;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  todo.deleted = false;
  res.json({ message: "Todo restored" });
};
