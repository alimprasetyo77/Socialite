import { NextFunction, Request, Response } from "express";
import { IUserSchema } from "../model/user-model";
import { createNotificationService, getNotificationService } from "../service/notification-service";

// export const createNotification = async (
//   req: Request & { user?: IUserSchema },
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     await createNotificationService(req.user!, req.body);
//     res.status(201).json({ message: "Create notification successfuly." });
//   } catch (error) {
//     next(error);
//   }
// };
export const getNotifications = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getNotificationService(req.user!);
    res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
};
