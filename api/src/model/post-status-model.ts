import mongoose, { InferSchemaType, model, Schema } from "mongoose";

const postStatusSchema = new Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: { type: String, maxlength: 200 },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const PostStatus = model("Posts_Status", postStatusSchema);
export type IPostStatus = InferSchemaType<typeof postStatusSchema>;

export default PostStatus;
