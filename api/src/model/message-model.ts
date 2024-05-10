import mongoose, { InferSchemaType, model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    seen: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);
export type IMessageSchema = InferSchemaType<typeof messageSchema>;
export default Message;
