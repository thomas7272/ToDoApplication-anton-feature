import express from "express";
import mongoose from "mongoose";
import AuthMiddleware from "./middlewares/auth-middleware.js";
import apiRoute, { apiProtected } from "./routes/api.js";
import { DB_CONNECT } from "./utils/constants.js";
import cors from "cors";

const app = express();

mongoose.connect(DB_CONNECT, { useNewUrlParser: true }, (e) => console.log(e));
const PORT = 8001;

app.use(cors());
app.use(express.json());
app.use("/api/", apiRoute);
app.use("/api/", AuthMiddleware, apiProtected);

app.options("*", cors());

app.use((err, req, res, next) => {
  console.error("Internal server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => console.log("server is running "));
