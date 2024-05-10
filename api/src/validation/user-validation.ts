import { z, ZodType } from "zod";
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;

export const REGISTER: ZodType = z.object({
  username: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  password: z.string().min(1).max(100),
  email: z.string().email({ message: "Invalid Email" }),
});

export const LOGIN: ZodType = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(1).max(100),
});
export const UPDATE: ZodType = z.object({
  username: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(100).optional(),
  email: z.string().email({ message: "Invalid Email" }).optional(),
});
export const UPDATE_PHOTO = z.object({
  profilePic: z
    .string()
    .min(1, { message: "Image required" })
    .refine(
      (data) => {
        const base64Part = data?.split(",")[1] || data;
        return base64Regex.test(base64Part as string);
      },
      { message: "Invalid format base64" }
    ),
});
export const UPDATE_PASSWORD: ZodType = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export const KEYWORD: ZodType = z.object({
  keyword: z.string().min(1),
});

export const ADD_BIO = z.object({
  live: z.string().min(1).optional(),
  studi: z.string().min(1).optional(),
  work: z.string().min(1).optional(),
});

export const ADD_NOTIFICATION: ZodType = z.object({
  type: z.enum(["like", "follow", "message"]),
  recipientId: z.string().min(12),
  message: z.string().optional(),
  post: z.string().optional(),
  read: z.boolean(),
});
