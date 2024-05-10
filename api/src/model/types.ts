import mongoose, { ObjectId } from "mongoose";

export interface UserResponse {
  _id: ObjectId;
  profilePic: string;
  coverPic: string;
  username: string;
  name: string;
  email: string;
  token?: string;
  following: string[];
  followers: string[];
  bio: {
    live: string;
    work: string;
    studi: string;
  };
}
export interface CreateUserRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  name: string;
  username: string;
  email: string;
}

export interface UpdatePasswordUserRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreatePostRequest {
  postedBy: string;
  text: string;
  img: string;
}
export interface CreatePostStatusRequest {
  postedBy: string;
  caption: string;
  image: string;
}
export interface SendMessageRequest {
  recipientId: string;
  message: string;
}

export interface BioRequest {
  live: string;
  studi: string;
  work: string;
}

export interface NotificationRequest {
  type: "follow" | "like" | "message";
  recipientId: string;
  message?: string;
  post?: string;
  read: boolean;
}
