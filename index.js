import express from "express";
import dotenv from "dotenv";

const app = express();
const PORT = 8000;

app.get("/api/v1", (req, res) => {
  res.send("server is working");
});

app.listen(PORT, () => {
  console.log("server is live on ");
});
