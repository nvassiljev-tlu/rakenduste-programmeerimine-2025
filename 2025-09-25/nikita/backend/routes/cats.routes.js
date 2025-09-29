const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const catsController = require("../controllers/cats.controller");
const {
  catsRouteMiddleware,
  catsGetRouteMiddleware,
} = require("../middlewares/cats.middlewares");

router.use(catsRouteMiddleware);

// /cats/ Get endpoint level middleware
router.get("/", catsGetRouteMiddleware, catsController.read);
router.post(
  "/",
  body("name").isString().notEmpty().withMessage("Name is required"),
  catsController.create
);
router.put("/:name", catsController.update);
router.delete("/:name", catsController.delete);

module.exports = router;