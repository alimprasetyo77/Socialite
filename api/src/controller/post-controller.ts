import { NextFunction, Request, response, Response } from "express";
import { CreatePostRequest, CreatePostStatusRequest } from "../model/types";
import {
  Create,
  CreatePostStatus,
  deletePostService,
  getFeedPostsService,
  getPostService,
  getPostStatusService,
  getUserPostService,
  likeUnlikeService,
  replyPostService,
} from "../service/post-service";
import { IUserSchema } from "../model/user-model";

export const createPost = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const request: CreatePostRequest = req.body;
    await Create(req.user!, request);
    res.status(201).json({
      message: "Create post successfuly",
    });
  } catch (e) {
    next(e);
  }
};
export const createPostStatus = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const request: CreatePostStatusRequest = req.body;
    await CreatePostStatus(req.user!, request);
    res.status(201).json({ message: "Create post status succesfuly." });
  } catch (e) {
    next(e);
  }
};

export const getPostStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await getPostStatusService();
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
};
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await getPostService(req.params.id);
    res.status(200).json({
      data: response.data,
    });
  } catch (e) {
    next(e);
  }
};

export const deletePost = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    await deletePostService(req.user!, req.params.id);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

export const likeUnlikePost = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await likeUnlikeService(req.user!, req.params.id);
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export const ReplyToPost = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    await replyPostService(req.user!, req.body, req.params.id);
    res.status(200).json({
      message: "Post reply successfuly",
    });
  } catch (e) {
    next(e);
  }
};

export const getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await getUserPostService(req.params.id);
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export const getFeedPosts = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getFeedPostsService(req.user!, req.query.size as any);
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};
