import express, { Request, Response } from "express";
import { login, register } from "../controller/user-controller";

export const publicRouter = express.Router();

// Auth
publicRouter.post("/user", register);
publicRouter.post("/user/login", login);
publicRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "TESTING" });
});
