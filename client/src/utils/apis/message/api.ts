import axiosWithConfig from "../axios-with-config";
import { IConversation, IConversations, IMessage, IMessagePayload } from "./types";

export const getConversations = async () => {
  try {
    const response = await axiosWithConfig.get("conversations");
    return response.data as { data: IConversations[] };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};
export const getConversationById = async (id: string) => {
  try {
    const response = await axiosWithConfig.get("conversation/" + id);
    return response.data as { data: IConversation };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};
export const getMessages = async (userId: string) => {
  try {
    const response = await axiosWithConfig.get(`message/${userId}`);
    return response.data as { data: IMessagePayload[] };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};
export const sendMessage = async (body: IMessage) => {
  try {
    const response = await axiosWithConfig.post("message", body);
    return response.data as { data: IMessagePayload };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};
