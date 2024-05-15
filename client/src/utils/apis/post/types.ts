import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const PostSchema = z.object({
  text: z.string().max(500),
  img: z
    .any()
    .optional()
    .refine((files) => files?.length === 0 || (files && files[0].size <= MAX_FILE_SIZE), {
      message: "Max image size is 5MB",
    })
    .refine(
      (files) => files?.length === 0 || (files && ACCEPTED_IMAGE_TYPES.includes(files[0].type)),
      {
        message: "Only .jpg, .jpeg, .png formats are supported",
      }
    ),
});
export const PostStatusSchema = z.object({
  caption: z.string().max(200),
  fileUrl: z
    .instanceof(FileList)
    .refine((check) => check.length >= 1, { message: "Image or video is required" })
    .refine((check) => check[0].type === "video/mp4" || check[0].type.startsWith("image/"), {
      message: "File allowed with image or video",
    }),
});

export type IPostType = z.infer<typeof PostSchema>;
export type IPostStatusType = z.infer<typeof PostStatusSchema>;
export interface IPostStatus {
  _id: string;
  postedBy: {
    _id: string;
    name: string;
    profilePic: string;
  };
  posts: {
    type: string;
    caption: string;
    fileUrl: string;
    _id: string;
    created_at: Date;
  }[];
}

export interface IDeletePost {
  postId: string;
  itemPostId: string;
}
