const express = require("express");
const todosRouter = require("./routes/todos");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/todos", todosRouter);

app.listen(PORT, () => {
  console.log(`Todo API listening on http://localhost:${PORT}/api`);
});

module.exports = app;
