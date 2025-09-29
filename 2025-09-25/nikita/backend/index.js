const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const catsRoutes = require("./routes/cats.routes");
const todosRoutes = require("./routes/todos.routes");
const { login } = require("./middlewares/todos.middlewares");

app.use(cors());
app.use(express.json());

app.use("/cats", catsRoutes);
app.use("/todos", todosRoutes);

app.post("/login", express.json(), login);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
