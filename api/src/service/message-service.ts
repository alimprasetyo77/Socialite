import { isValidObjectId } from "mongoose";
import { getRecipientSocketId, io } from "../application/socket";
import { ResponseError } from "../error/error-response";
import Conversation from "../model/conversation-model";
import Message from "../model/message-model";
import { SendMessageRequest } from "../model/types";
import { IUserSchema } from "../model/user-model";

export const sendMessageService = async (
  user: IUserSchema,
  request: SendMessageRequest
): Promise<any> => {
  const { message, recipientId } = request;
  const senderId = user._id;
  if (!recipientId && !message) throw ResponseError(400, "Recipientid and message is required");
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, recipientId] },
  });
  if (!conversation) {
    conversation = new Conversation({
      participants: [senderId, recipientId],
      lastMessage: {
        test: message,
        sender: senderId,
      },
    });
    await conversation.save();
  }
  const newMessage = new Message({
    conversationId: conversation._id,
    sender: senderId,
    text: message,
  });
  await Promise.all([
    newMessage.save(),
    conversation.updateOne({
      lastMessage: {
        text: message,
        sender: senderId,
      },
    }),
  ]);
  const recipientSocketId = getRecipientSocketId(recipientId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit("newMessage", newMessage);
  }

  return newMessage;
};
export const getMessagesService = async (user: IUserSchema, otherUserId: string): Promise<any> => {
  const userId = user._id;
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, otherUserId] },
  });
  if (!conversation) throw ResponseError(404, "Conversation not found");

  const messages = await Message.find({
    conversationId: conversation._id,
  }).sort({ createdAt: 1 });
  return messages;
};

export const getConversationByIdService = async (
  user: IUserSchema,
  conversationId: string
): Promise<any> => {
  if (!isValidObjectId(conversationId)) throw ResponseError(400, "Invalid conversation id");
  const conversation = await Conversation.findOne({ _id: conversationId })
    .populate({
      path: "participants",
      select: "username profilePic",
    })
    .select("participants");
  if (!conversation) throw ResponseError(404, "Conversation not found");
  conversation.participants = conversation.participants.filter(
    (participant) => participant._id.toString() !== user._id.toString()
  );
  return conversation;
};

export const getConversationsService = async (user: IUserSchema): Promise<any> => {
  const userId = user._id;
  const conversations = await Conversation.find({ participants: userId })
    .populate({
      path: "participants",
      select: "username profilePic",
    })
    .sort({ createdAt: -1 });

  // remove the current user from the participants array
  conversations.forEach((conversation) => {
    conversation.participants = conversation.participants.filter(
      (participant) => participant._id.toString() !== userId.toString()
    );
  });

  return conversations;
};
