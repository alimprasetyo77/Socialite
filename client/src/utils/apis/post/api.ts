import axios from "axios";
import { getBase64 } from "../../formatter";
import axiosWithConfig from "../axios-with-config";
import { IFeedType } from "../feed/types";
import { IDeletePost, IPostStatus, IPostStatusType, IPostType } from "./types";
type signatureFolder = "videos" | "images";
type fileType = "video" | "image";
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

export const getSignature = async (folder: signatureFolder) => {
  try {
    const response = await axiosWithConfig.post("signatureUpload", { folder: folder });
    return response.data as { signature: string; timestamp: any };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};
export const uploadFilePostStatus = async (
  type: fileType,
  file: File,
  timestamp: any,
  signature: string
) => {
  const folder = type === "image" ? "images" : "videos";

  const data = new FormData();
  data.append("file", file);
  data.append("timestamp", timestamp);
  data.append("signature", signature);
  data.append("api_key", import.meta.env.VITE_CLOUDINARY_APIKEY);
  data.append("folder", folder);

  try {
    let cloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME;
    let resourceType = type === "image" ? "image" : "video";
    let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const res = await axios.post(api, data);
    const { secure_url } = res.data;
    return { type, secure_url } as { type: string; secure_url: any };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};
export const postStatus = async (body: IPostStatusType & { type: string }, userId: string) => {
  try {
    const response = await axiosWithConfig.post("post-status", {
      posts: { ...body },
      postedBy: userId,
    });
    return response.data as { message: "Create post successfuly" };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const getPostsStatus = async () => {
  try {
    const response = await axiosWithConfig.get("post-status");

    return response.data as { data: IPostStatus[] };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const deletePostStatus = async (body: IDeletePost) => {
  try {
    const response = await axiosWithConfig.put("post-status", {
      ...body,
    });
    return response.data as { message: string };
  } catch (error: any) {
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
