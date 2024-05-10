import { ILoginType, IRegisterType, IResLogin } from "./types";
import axiosWithConfig from "../axios-with-config";

export const login = async (body: ILoginType) => {
  try {
    const response = await axiosWithConfig.post("user/login", body);
    return response.data as IResLogin;
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};
export const register = async (body: IRegisterType) => {
  try {
    const response = await axiosWithConfig.post("user", body);
    return response.data as IResLogin;
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};

export const logout = async () => {
  try {
    const response = await axiosWithConfig.put("logout");
    return response.data as { message: string };
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
};
