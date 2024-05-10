import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IUser } from "../apis/user/types";
import { getUser } from "../apis/user/api";
import toast from "react-hot-toast";
import axiosWithConfig, { setAxiosConfig } from "../apis/axios-with-config";
import useTheme from "../hooks/use-theme";
interface Context {
  token: string;
  user: Partial<IUser>;
  changeToken: (token?: string) => void;
  fetchCurrentUser: () => void;
  theme: any;
  toggleTheme: any;
}

const AuthContext = createContext<Context>({
  token: "",
  user: {},
  changeToken: () => {},
  fetchCurrentUser: () => {},
  theme: "",
  toggleTheme: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token") ?? "");
  const [user, setUser] = useState<Partial<IUser>>({});
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    setAxiosConfig(token);
    token !== "" && fetchCurrentUser();
  }, [token]);

  axiosWithConfig.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        toast(error.toString());
        changeToken();
      }
      return Promise.reject(error);
    }
  );

  const fetchCurrentUser = useCallback(async () => {
    try {
      const result = await getUser();
      setUser(result.data);
    } catch (error) {
      toast.error(`${error}`);
    }
  }, [token]);

  const changeToken = useCallback(
    (token?: string) => {
      const newToken = token ?? ""; // const newToken = token ? token : "";
      setToken(newToken);
      if (token) {
        localStorage.setItem("token", newToken);
      } else {
        localStorage.removeItem("token");
        setUser({});
      }
    },
    [token]
  );

  const authContextValue = useMemo(() => {
    return {
      token,
      user,
      changeToken,
      fetchCurrentUser,
      theme,
      toggleTheme,
    };
  }, [token, user, changeToken, fetchCurrentUser, theme, toggleTheme]);

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("ERROR, useAuth must be used within authContext");
  }

  return context;
};
