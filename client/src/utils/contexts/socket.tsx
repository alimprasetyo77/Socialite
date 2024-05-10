import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "./auth";

interface Context {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<Context>({
  socket: null,
  onlineUsers: [],
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const newSocket = io("http://localhost:8000/", {
      query: {
        userId: user._id,
      },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users: any[]) => {
      setOnlineUsers(users);
    });
    return () => {
      if (newSocket) newSocket.close();
    };
  }, [user._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>
  );
};
