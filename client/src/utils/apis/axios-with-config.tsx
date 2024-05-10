import axios from "axios";

let bearerToken = "";

const axiosWithConfig = axios.create();

export const setAxiosConfig = (token: string) => {
  bearerToken = token;
};

axiosWithConfig.interceptors.request.use((axiosConfig) => {
  axiosConfig.baseURL = "https://rest-api-social-media.vercel.app/";
  axiosConfig.headers.Authorization = `Bearer ${bearerToken}`;
  return axiosConfig;
});

export default axiosWithConfig;
