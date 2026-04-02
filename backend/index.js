const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/api/editor", (req, res) => {
  res.json({
    title: "Untitled Puzzle",
    gridSize: 15,
    cells: Array(15 * 15).fill({ letter: "", blocked: false }),
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});