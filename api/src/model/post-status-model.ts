import mongoose, { InferSchemaType, model, Schema } from "mongoose";

const postStatusSchema = new Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  posts: [
    {
      type: { type: String, required: true },
      caption: { type: String, maxlength: 200 },
      fileUrl: { type: String, required: true },
      created_at: { type: Date, default: Date.now },
    },
  ],
});

const PostStatus = model("Posts_Status", postStatusSchema);
export type IPostStatus = InferSchemaType<typeof postStatusSchema>;

export default PostStatus;
