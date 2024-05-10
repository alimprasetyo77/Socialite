import { z } from "zod";
// const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePic: string;
  coverPic: string;
  bio: {
    live: string;
    studi: string;
    work: string;
  };
  followers: string[];
  following: string[];
}

export interface ISearchUser {
  _id: string;
  name: string;
  profilePic: string;
}

export const userUpdateSchema = z.object({
  name: z.string().min(1, { message: "Enter your  name " }),
  username: z.string().min(1, { message: "Enter your username" }),
  email: z.string().min(1, { message: "Enter your email" }).email("Enter a valid email"),
});

export const userSecurityUpdateSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Current password must be at least 6 characters" }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
    repeatPassword: z.string().min(6, { message: "Repeat password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.repeatPassword, { message: "Password don't match" });

export const addbioSchema = z.object({
  live: z.string().optional(),
  work: z.string().optional(),
  studi: z.string().optional(),
});

export type IUserBio = z.infer<typeof addbioSchema>;
export type IUserUpdateType = z.infer<typeof userUpdateSchema>;
export type IUserSecurityUpdateType = z.infer<typeof userSecurityUpdateSchema>;
