import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { INotification } from "../apis/notification/types";
import { useSocket } from "./socket";
import { useAuth } from "./auth";
import { getNotifications } from "../apis/notification/api";
import toast from "react-hot-toast";
import { usePopup } from "./popup";

interface Context {
  notifications: INotification[];
  unreadNotifications: INotification[];
}

const notificationContext = createContext<Context>({
  notifications: [],
  unreadNotifications: [],
});

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<INotification[]>([]);
  const { socket } = useSocket();
  const { user, token } = useAuth();
  const { state } = usePopup();

  useEffect(() => {
    socket?.on("newNotification", (notif: INotification) => {
      if (notif.recipientId === user._id) {
        setNotifications((prev) => [...prev, notif].reverse());
        setUnreadNotifications((prev) => [...prev, notif]);
      }
    });
    socket?.on("notificationRead", (readNotif) => {
      setUnreadNotifications(readNotif);
    });
    return () => {
      socket?.off("newNotification");
      socket?.off("notificationRead");
    };
  }, [socket, user._id, notifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await getNotifications();
        setNotifications(result.data);
        setUnreadNotifications(result.data.filter((value) => value.read === false));
      } catch (error: any) {
        toast.error(error.toString());
      }
    };
    token !== "" && fetchNotifications();
  }, [state.isOpenNotification]);
  return (
    <notificationContext.Provider value={{ notifications, unreadNotifications }}>
      {children}
    </notificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(notificationContext);
};
