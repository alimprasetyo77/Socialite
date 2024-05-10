import { InferSchemaType, Schema, model } from "mongoose";
import mongoose from "mongoose";
const postSchema = new Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
    likes: {
      // array of user ids
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        name: {
          type: String,
        },
        createAt: { type: Date, default: new Date() },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Post = model("Post", postSchema);
export type IPostSchema = InferSchemaType<typeof postSchema>;
export default Post;
