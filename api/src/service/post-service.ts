import mongoose, { isValidObjectId } from "mongoose";
import { ResponseError } from "../error/error-response";
import Post, { IPostSchema } from "../model/post-model";
import { CreatePostRequest, CreatePostStatusRequest } from "../model/types";
import User, { IUserSchema } from "../model/user-model";
import { POST, POST_STATUS, REPLY_POST } from "../validation/post-validation";
import { validate } from "../validation/validation";
import { v2 as cloudinary } from "cloudinary";
import { createNotificationService } from "./notification-service";
import PostStatus from "../model/post-status-model";

export const Create = async (user: IUserSchema, request: CreatePostRequest): Promise<void> => {
  const requestValidation = validate(POST, request);
  let { img, postedBy, text } = requestValidation;

  const currentUser = await User.findById(requestValidation.postedBy);

  if (!currentUser) {
    throw ResponseError(404, "User not found");
  }

  if (currentUser._id != user.id) {
    throw ResponseError(401, "Unauthorized to create post ");
  }

  if (img) {
    const uploadedResponse = await cloudinary.uploader.upload(img);
    img = uploadedResponse.secure_url;
  }
  const newPost = new Post({
    postedBy,
    text,
    img,
  });

  await newPost.save();
};

export const CreatePostStatus = async (
  user: IUserSchema,
  request: CreatePostStatusRequest
): Promise<any> => {
  const requestValidation = validate(POST_STATUS, request);
  let { postedBy, caption, image } = requestValidation;

  const currentUser = await User.findById(postedBy);

  if (!currentUser) {
    throw ResponseError(404, "User not found");
  }

  if (currentUser._id != user.id) {
    throw ResponseError(401, "Unauthorized to create post ");
  }
  const uploadedResponse = await cloudinary.uploader.upload(image);
  image = uploadedResponse.secure_url;

  const newPostStatus = new PostStatus(
    {
      postedBy,
      caption,
      image,
    },
    { expireAfterSeconds: 3600 }
  );
  await newPostStatus.save();
};

export const getPostStatusService = async (): Promise<any> => {
  const posts = await PostStatus.find();
  return posts;
};

export const getPostService = async (postId: string): Promise<{ data: IPostSchema }> => {
  const post = await Post.findById(postId);
  if (!post) throw ResponseError(404, "Post not found");
  return {
    data: post,
  };
};

export const deletePostService = async (user: IUserSchema, postId: string): Promise<any> => {
  const post = await Post.findById(postId);

  if (!post) throw ResponseError(404, "Post not found");
  if (post.postedBy != user.id) throw ResponseError(401, "Unauthorized to delete post");
  if (post.img) {
    const imgId = post.img.split("/")?.pop()?.split(".")[0];
    await cloudinary.uploader.destroy(imgId!);
  }

  await Post.findByIdAndDelete(postId);
};

export const likeUnlikeService = async (
  user: IUserSchema,
  postId: string
): Promise<{ message: string }> => {
  const post = await Post.findById(postId);

  if (!post) throw ResponseError(404, "Post not found");

  const userLikedPost = post.likes.includes(user.id);

  if (userLikedPost) {
    // unlike
    await Post.updateOne(
      { _id: postId },
      {
        $pull: { likes: user.id },
      }
    );
    return { message: "Post unliked successfuly" };
  } else {
    // like
    post.likes.push(user.id);
    await post.save();
    await createNotificationService(user, {
      type: "like",
      recipientId: post.postedBy.toString(),
      post: postId,
      read: false,
    });
    return { message: "Post liked successfuly" };
  }
};

export const replyPostService = async (
  user: IUserSchema,
  request: { text: string },
  postId: string
): Promise<any> => {
  const requestValidation = validate(REPLY_POST, request);

  if (!isValidObjectId(postId)) throw ResponseError(404, "Post not found");

  const post = await Post.findById(postId);
  if (!post) throw ResponseError(404, "Post not found");

  post.replies.push({
    name: user.name,
    text: requestValidation.text,
    userId: user.id,
    userProfilePic: user.profilePic,
  });
  await post.save();
};

export const getUserPostService = async (id: string): Promise<any> => {
  const post = await Post.find({ postedBy: { $eq: id } }).sort({ createdAt: -1 });
  if (!post.length) return { message: "You have no posts" };
  return {
    data: post,
  };
};

export const getFeedPostsService = async (user: IUserSchema, page: number): Promise<any> => {
  const following = user.following;

  // Cari dokumen terbaru dari user yang login
  let latestPostByUser = await Post.findOne({ postedBy: user._id }).sort({ createdAt: -1 });

  // Looping following dan ambil feed post
  const feedPosts = await Post.find({ postedBy: { $in: following } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * 2)
    .limit(2);
  if (!feedPosts.length) return { data: [] };
  const postDate = latestPostByUser?.createdAt.getTime();

  // Gabungkan data terbaru dengan feedPosts
  if (latestPostByUser && postDate! < Date.now() - 60000) {
    latestPostByUser = null;
  }

  if (latestPostByUser) {
    feedPosts.unshift(latestPostByUser);
  }

  return { data: feedPosts };
};
