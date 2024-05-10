import mongoose, { Document, model, ObjectId, Schema } from "mongoose";
import { UserResponse } from "./types";

export interface IUserSchema extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  token?: string;
  profilePic?: string;
  coverPic?: string;
  followers: string[];
  following: string[];
  bio: {
    live: string;
    work: string;
    studi: string;
  };
}

const userSchema = new Schema<IUserSchema>({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String },
  profilePic: { type: String, default: "" },
  coverPic: { type: String, defualt: "" },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  bio: {
    live: { type: String, default: "" },
    work: { type: String, default: "" },
    studi: { type: String, default: "" },
  },
});

const User = model("User", userSchema);

export const toUserResponse = (user: IUserSchema): UserResponse => {
  return {
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic!,
    coverPic: user.coverPic!,
    followers: user.followers,
    following: user.following,
    bio: user.bio,
  };
};
export default User;
