import { NextFunction, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/error-response";

export const errorMiddleware = async (
  error: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    let errors: { [key: string]: string } = {};
    for (let err of error.errors) {
      errors[err.path[0]] = err.message;
    }
    res.status(400).json({
      errors: JSON.stringify(errors),
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status as number).json({
      errors: error.message,
    });
  } else {
    res.status(500).json({
      errors: error.message,
    });
  }
};
