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
  caption: z.string().max(500),
  file: z.any(),
});

export type IPostType = z.infer<typeof PostSchema>;
export type IPostStatusType = z.infer<typeof PostStatusSchema>;
