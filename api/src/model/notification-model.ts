import mongoose, { InferSchemaType, model, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    read: { type: Boolean, defalut: false },
    type: { type: String, enum: ["like", "follow", "message"], required: true },
  },
  { timestamps: true }
);

const Notification = model("Notifications", notificationSchema);
type NotificationSchemaTypes = InferSchemaType<typeof notificationSchema>;

export type INotification = Omit<NotificationSchemaTypes, "createdAt" | "updatedAt">;
export default Notification;
