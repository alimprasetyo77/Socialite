import { NextFunction, Request, Response } from "express";
import { IUserSchema } from "../model/user-model";
import {
  getConversationByIdService,
  getConversationsService,
  getMessagesService,
  sendMessageService,
} from "../service/message-service";

export const sendMessage = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await sendMessageService(req.user!, req.body);
    return res.status(201).json({ data: response });
  } catch (error: any) {
    next(error);
  }
};
export const getMessages = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getMessagesService(req.user!, req.params.otherUserId);
    return res.status(200).json({ data: response });
  } catch (error: any) {
    next(error);
  }
};

export const getConversation = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getConversationByIdService(req.user!, req.params.id);
    return res.status(200).json({ data: response });
  } catch (error: any) {
    next(error);
  }
};

export const getConversations = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getConversationsService(req.user!);
    return res.status(200).json({ data: response });
  } catch (error: any) {
    next(error);
  }
};
