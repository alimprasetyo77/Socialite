import express from "express";
import connectDB from "./database";
import { apiRouter } from "../route/api";
import { errorMiddleware } from "../middleware/error-middleware";
import { publicRouter } from "../route/public-router";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

export const app = express();
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const corsOptions = {
  origin: "*", // Allow requests from any origin (for development purposes)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
// app.use(cookieParser());

app.use(publicRouter);
app.use(apiRouter);
app.use(errorMiddleware as any);
