import http from "http";
import { app } from "./web";
import { Server } from "socket.io";
import Message from "../model/message-model";
import Conversation from "../model/conversation-model";
import Notification from "../model/notification-model";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://socialite-client-three.vercel.app",
    methods: ["GET", "POST"],
  },
});
const userSocketMap: { [key: string]: any } = {};

export const getRecipientSocketId = (recipientId: string) => {
  return userSocketMap[recipientId];
};

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const userId: any = socket.handshake.query.userId;

  if (userId != "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        { conversationId: conversationId, seen: false },
        { $set: { seen: true } }
      );
      await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
      io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("markNotificationsRead", async ({ userId }) => {
    try {
      await Notification.updateMany(
        {
          recipientId: userId,
          read: false,
        },
        { $set: { read: true } }
      );
      io.to(userSocketMap[userId]).emit("notificationRead", []);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
export { io, server };
