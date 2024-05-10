import {
  BioRequest,
  CreateUserRequest,
  LoginUserRequest,
  UpdatePasswordUserRequest,
  UpdateUserRequest,
} from "../model/types";
import {
  ADD_BIO,
  KEYWORD,
  LOGIN,
  REGISTER,
  UPDATE,
  UPDATE_PASSWORD,
  UPDATE_PHOTO,
} from "../validation/user-validation";
import { validate } from "../validation/validation";
import User, { IUserSchema, toUserResponse } from "../model/user-model";
import { ResponseError } from "../error/error-response";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { createNotificationService } from "./notification-service";

export const registerService = async (request: CreateUserRequest): Promise<void> => {
  const registerRequest = validate(REGISTER, request);

  const userWithSameUsername = await User.find({ username: { $eq: registerRequest.username } });

  if (userWithSameUsername.length !== 0) {
    throw ResponseError(400, "Username already exists");
  }

  if (userWithSameUsername[0]?.email === registerRequest?.email) {
    throw ResponseError(400, "Email already exists");
  }

  registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

  const user = new User({
    username: registerRequest.username,
    name: registerRequest.name,
    email: registerRequest.email,
    password: registerRequest.password,
  });

  await user.save();
};

export const loginService = async (request: LoginUserRequest): Promise<{ token: string }> => {
  const loginRequest = validate(LOGIN, request);
  let user = await User.findOne({ email: loginRequest.email });
  if (!user) throw ResponseError(401, "Email or password is wrong");

  const isValidPassword = await bcrypt.compare(loginRequest.password, user.password!);
  if (!isValidPassword) throw ResponseError(401, "Email or password is wrong");

  const token = jwt.sign({ id: user._id }, "secret", {
    expiresIn: "1d",
  });

  user.token = token; // simpan ke database
  await user.save();

  return {
    token,
  };
};

export const LogoutService = async (id: string): Promise<void> => {
  await User.updateOne(
    { _id: id },
    {
      $set: {
        token: null,
      },
    }
  );
};

export const getPeopleService = async (user: IUserSchema) => {
  let suggestedUsers = await User.find({
    _id: { $ne: user._id },
  }).limit(10);

  const following = user.following;
  const filteredUser = suggestedUsers.filter((user) => !following.includes(user._id));
  const result = filteredUser.slice(0, 5);

  return result ?? suggestedUsers;
};

export const Get = async (user: IUserSchema, query: string): Promise<any> => {
  let result: IUserSchema;

  if (!query) {
    result = user;
  } else if (mongoose.Types.ObjectId.isValid(query)) {
    result = await User.findById(query).select(["-password", "-token"]);
  } else {
    result = await User.findOne({ username: query }).select(["-password", "-token"]);
  }
  if (!result) throw ResponseError(404, "User not found");

  return toUserResponse(result as IUserSchema);
};

export const getUserByName = async (user: IUserSchema, query: { keyword: string }) => {
  const { keyword } = validate(KEYWORD, query);
  let users = await User.find({ name: { $regex: `^${keyword}`, $options: "i" } }).select([
    "_id",
    "name",
    "profilePic",
  ]);
  users = users.filter((value) => value._id !== user._id);
  return users;
};

export const Update = async (user: IUserSchema, request: UpdateUserRequest): Promise<void> => {
  const updateRequest = validate(UPDATE, request);

  await User.updateOne(
    { _id: user.id },
    {
      $set: {
        name: updateRequest.name,
        username: updateRequest.username,
        email: updateRequest.email,
      },
    }
  );
};
export const UpdatePhoto = async (
  user: IUserSchema,
  request: { profilePic: string }
): Promise<void> => {
  const updateRequest: { profilePic: string } = validate(UPDATE_PHOTO, request);

  let { profilePic } = updateRequest;

  if (profilePic) {
    if (user.profilePic) {
      await cloudinary.uploader.destroy(user.profilePic.split("/")!.pop()!.split(".")[0]);
    }
    const uploadedResponse = await cloudinary.uploader.upload(profilePic);
    profilePic = uploadedResponse.secure_url;
  }
  await User.updateOne(
    { _id: user.id },
    {
      $set: { profilePic },
    }
  );
};
export const Delete = async (id: string): Promise<void> => {
  await User.deleteOne({ _id: id });
};

export const UpdatePassword = async (
  user: IUserSchema,
  request: UpdatePasswordUserRequest
): Promise<void> => {
  const updatePasswordRequest = validate(UPDATE_PASSWORD, request);
  const isValidPassword = await bcrypt.compare(
    updatePasswordRequest.currentPassword,
    user.password
  );
  if (!isValidPassword) throw ResponseError(401, "Current password is incorrect");
  const newPassword = await bcrypt.hash(updatePasswordRequest.newPassword, 10);
  await User.updateOne(
    { _id: user.id },
    {
      $set: { password: newPassword },
    }
  );
};

export const followUnFollowUserService = async (
  user: IUserSchema,
  userId: string
): Promise<{ message: string }> => {
  const userToModify = await User.findById(userId);
  if (user.id == userId) throw ResponseError(400, "You cannot follow/unfollow yourself");
  if (!userToModify) throw ResponseError(404, "User not found");

  const isFollowing = user.following.includes(userId);

  if (isFollowing) {
    await User.findByIdAndUpdate(userId, { $pull: { followers: user.id } });
    await User.findByIdAndUpdate(user.id, { $pull: { following: userId } });
    return { message: "User unfollowed successfuly" };
  } else {
    await User.findByIdAndUpdate(userId, { $push: { followers: user.id } });
    await User.findByIdAndUpdate(user.id, { $push: { following: userId } });
    await createNotificationService(user, {
      type: "follow",
      recipientId: userId,
      read: false,
    });
    return { message: "User followed successfuly" };
  }
};

export const uploadCoverPicService = async (
  user: IUserSchema,
  request: { coverPic: string }
): Promise<any> => {
  let { coverPic } = request;
  if (!coverPic) throw ResponseError(400, "Image is required");

  if (user.coverPic) {
    await cloudinary.uploader.destroy(user.coverPic.split("/")!.pop()!.split(".")[0]);
  }
  const uploadedResponse = await cloudinary.uploader.upload(coverPic);
  coverPic = uploadedResponse.secure_url;

  await User.updateOne(
    { _id: user.id },
    {
      $set: { coverPic: coverPic },
    }
  );
};

export const addBioService = async (user: IUserSchema, request: BioRequest): Promise<any> => {
  const requestValidation = validate(ADD_BIO, request);
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        bio: {
          live: requestValidation.live,
          studi: requestValidation.studi,
          work: requestValidation.work,
        },
      },
    }
  );
};
