const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const todosController = require("../controllers/todos.controller");
const {
  authenticateJWT,
  requireAdmin,
} = require("../middlewares/todos.middlewares");

router.use(authenticateJWT);

router.get("/", todosController.read);
router.post("/", body("text").isString().notEmpty(), todosController.create);
router.put("/:id", todosController.update);
router.delete("/:id", todosController.delete);
router.post("/:id/restore", requireAdmin, todosController.restore);

module.exports = router;
