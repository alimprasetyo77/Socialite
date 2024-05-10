import { NextFunction, Request, Response } from "express";
import { CreateUserRequest, LoginUserRequest } from "../model/types";
import {
  addBioService,
  Delete,
  followUnFollowUserService,
  Get,
  getPeopleService,
  getUserByName,
  loginService,
  LogoutService,
  registerService,
  Update,
  UpdatePassword,
  UpdatePhoto,
  uploadCoverPicService,
} from "../service/user-service";
import { IUserSchema } from "../model/user-model";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: CreateUserRequest = req.body;

    await registerService(request);
    res.status(200).json({
      message: "Register successfuly.",
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: LoginUserRequest = req.body;
    const response = await loginService(request);

    res.status(200).json({
      message: "Login successfuly.",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
export const logout = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const request = req.user;
    await LogoutService(request?.id);
    res.status(200).json({
      message: "Logout successfuly.",
    });
  } catch (error) {
    next(error);
  }
};

export const getPeople = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getPeopleService(req.user!);
    res.status(200).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const request = req.user;
    const response = await Get(request as IUserSchema, req.params.query);
    res.status(200).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const searchUser = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword } = req.query as unknown as { keyword: string };
    const response = await getUserByName(req.user!, { keyword });
    res.status(200).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    await Update(req.user!, req.body);
    res.status(200).json({
      message: "Update data successfuly",
    });
  } catch (error) {
    next(error);
  }
};
export const updatePhotoUser = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    await UpdatePhoto(req.user!, req.body);
    res.status(200).json({
      message: "Profile photo updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    await Delete(req.user?.id);
    res.status(200).json({
      message: "Delete data successfuly",
    });
  } catch (error) {
    next(error);
  }
};

export const changePasswordUser = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    await UpdatePassword(req.user!, req.body);
    res.status(200).json({
      message: "Update password successfuly",
    });
  } catch (error) {
    next(error);
  }
};

export const followUnFollowUser = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await followUnFollowUserService(req.user!, req.params.id);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const uploadCoverPic = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    await uploadCoverPicService(req.user!, req.body);
    res.status(201).json({ message: "Upload cover picture success" });
  } catch (error) {
    next(error);
  }
};

export const addBio = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    await addBioService(req.user!, req.body);
    res.status(201).json({ message: "Bio added." });
  } catch (error) {
    next(error);
  }
};
