import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/authRouter";
import cardRouter from "./routes/cardRouter";
import { authCheck } from "./midleware/auth";
import path from "path";
const cors = require("cors");
dotenv.config();

const { PORT } = process.env || 4000;

const app = express();

//MIDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
//ROUTES
app.use("/api/auth", authRouter);
app.use("/api/cards", authCheck, cardRouter);

mongoose.connect("mongodb://localhost:27017/generate-cards").then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
