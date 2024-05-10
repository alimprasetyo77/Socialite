import mongoose, { InferSchemaType, model, Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      seen: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);
const Conversation = model("Conversation", conversationSchema);
export type IConversationSchema = InferSchemaType<typeof conversationSchema>;
export default Conversation;
