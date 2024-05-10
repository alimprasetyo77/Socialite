import axiosWithConfig from "../axios-with-config";
import { INotification } from "./types";

export const getNotifications = async () => {
  try {
    const response = await axiosWithConfig.get("notifications");
    return response.data as { data: INotification[] };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};
