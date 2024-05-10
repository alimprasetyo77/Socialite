import axiosWithConfig from "../axios-with-config";
import { IFeedType } from "./types";

export const getFeedPosts = async (size?: number) => {
  try {
    const response = await axiosWithConfig.get(`feed?size=${size}`);
    return response.data as { data: IFeedType[] };
  } catch (error: any) {
    throw Error(error.response.message.errors);
  }
};
