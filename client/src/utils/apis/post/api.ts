import { getBase64 } from "../../formatter";
import axiosWithConfig from "../axios-with-config";
import { IFeedType } from "../feed/types";
import { IPostStatusType, IPostType } from "./types";

export const getMyPosts = async (userId: string) => {
  try {
    const response = await axiosWithConfig.get(`post-user/${userId}`);
    return response.data as { data: IFeedType[] };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const getPost = async (postId: string) => {
  try {
    const response = await axiosWithConfig.get(`post/${postId}`);
    return response.data as { data: IFeedType };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const postStatus = async (body: IPostStatusType, userId: string) => {
  try {
    if (body.file[0]) {
      const encodeBase64 = await getBase64(body.file[0]); // `file` your img file
      body.file = encodeBase64;
    }
    const response = await axiosWithConfig.post("post-status", {
      ...body,
      postedBy: userId,
    });
    return response.data as { message: "Create post successfuly" };
  } catch (error: any) {
    console.log(error);
    throw Error(error.response.data.errors);
  }
};
export const post = async (body: IPostType, userId: string) => {
  try {
    if (body.img[0]) {
      const encodeBase64 = await getBase64(body.img[0]); // `file` your img file
      body.img = encodeBase64;
    } else {
      body.img = "";
    }
    const response = await axiosWithConfig.post("post", {
      ...body,
      postedBy: userId,
    });
    return response.data as { message: "Create post successfuly" };
  } catch (error: any) {
    console.log(error);
    throw Error(error.response.data.errors);
  }
};
export const likeUnlike = async (postId: string) => {
  try {
    const response = await axiosWithConfig.put(`like/${postId}`);
    return response.data as { message: string };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const reply = async (text: string, postId: string) => {
  try {
    const response = await axiosWithConfig.post(`reply/${postId}`, {
      text: text,
    });
    return response.data as { message: string };
  } catch (error: any) {
    console.log(error);
    throw Error(error.response.data.errors.text);
  }
};
export const DeletePost = async (postId: string) => {
  try {
    const response = await axiosWithConfig.delete(`post/${postId}`);
    return response.data as { message: string };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};
