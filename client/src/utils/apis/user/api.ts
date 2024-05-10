import { ISearchUser, IUser, IUserBio, IUserSecurityUpdateType, IUserUpdateType } from "./types";
import axiosWithConfig from "../axios-with-config";
import { getBase64 } from "../../formatter";

export const getUser = async (id?: string) => {
  try {
    const response = id
      ? await axiosWithConfig.get(`users/${id}`)
      : await axiosWithConfig.get(`users`);
    return response.data as { data: IUser };
  } catch (error: any) {
    throw Error(error.response.message.errors);
  }
};
export const searchUser = async (keyword: string) => {
  try {
    const response = await axiosWithConfig.get(`user/search?keyword=${keyword}`);
    return response.data as { data: ISearchUser[] };
  } catch (error: any) {
    throw Error(error.response.data.errors.keyword);
  }
};

export const getPeople = async () => {
  try {
    const response = await axiosWithConfig.get("people");
    return response.data as { data: IUser[] };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const addBio = async (body: IUserBio) => {
  try {
    const response = await axiosWithConfig.post("addBio", body);
    return response.data as { message: string };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const followUnFollowUser = async (userId: string) => {
  try {
    const response = await axiosWithConfig.post(`follow/${userId}`);
    return response.data as { message: string };
  } catch (error: any) {
    throw Error(error.response.message.errors);
  }
};
export const updatePassword = async (body: IUserSecurityUpdateType) => {
  try {
    const response = await axiosWithConfig.put("changePassword", body);
    return response.data as { message: string };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const updatePhotoProfile = async (profilePic: any) => {
  try {
    const encodeBase64 = await getBase64(profilePic); // `file` your img file
    const response = await axiosWithConfig.put("changePhotoProfile", {
      profilePic: encodeBase64,
    });
    return response.data as { message: string };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const uploadCoverPic = async (coverPic: any) => {
  try {
    const encodeBase64 = await getBase64(coverPic); // `file` your img file
    const response = await axiosWithConfig.post("uploadCoverPic", {
      coverPic: encodeBase64,
    });
    return response.data as { message: string };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const updateUser = async (body: IUserUpdateType) => {
  try {
    const response = await axiosWithConfig.patch("users", body);
    return response.data as { message: string };
  } catch (error: any) {
    throw Error(error.response.message.errors);
  }
};
