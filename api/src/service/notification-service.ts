import { getRecipientSocketId, io } from "../application/socket";
import { ResponseError } from "../error/error-response";
import Notification from "../model/notification-model";
import { NotificationRequest } from "../model/types";
import { IUserSchema } from "../model/user-model";
import { ADD_NOTIFICATION } from "../validation/user-validation";
import { validate } from "../validation/validation";

export const createNotificationService = async (
  user: IUserSchema,
  request: NotificationRequest
): Promise<any> => {
  const requestValidation = validate(ADD_NOTIFICATION, request);
  const { message, type, recipientId, post, read } = requestValidation;
  const senderId = user._id;

  if (senderId.toString() === recipientId.toString()) return;

  const newNotification = new Notification({
    type,
    senderId,
    recipientId,
    message,
    post,
    read,
  });
  await newNotification.save();
  const populatedNotification = await Notification.findById(newNotification._id)
    .populate({
      path: "senderId",
      select: "name profilePic",
    })
    .populate({
      path: "post",
      select: "text",
    })
    .sort({ createdAt: -1 });
  const recipientSocketId = getRecipientSocketId(recipientId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit("newNotification", populatedNotification);
  }
};

export const getNotificationService = async (user: IUserSchema): Promise<any> => {
  const userId = user._id;
  const notifications = await Notification.find({ recipientId: userId })
    .populate({
      path: "senderId",
      select: "name profilePic",
    })
    .populate({
      path: "post",
      select: "text",
    })
    .sort({ createdAt: -1 });

  return notifications;
};
