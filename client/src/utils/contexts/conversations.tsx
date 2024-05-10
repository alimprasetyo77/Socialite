import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IConversations } from "../apis/message/types";
import { getConversations } from "../apis/message/api";
import toast from "react-hot-toast";
import { useAuth } from "./auth";
import { usePopup } from "./popup";

interface Context {
  conversations: IConversations[];
  unReadConversations: IConversations[];
  setConversations: Dispatch<SetStateAction<IConversations[]>>;
}

const conversationsContext = createContext<Context>({
  conversations: [],
  unReadConversations: [],
  setConversations: () => {},
});

export const ConversationsProvider = ({ children }: PropsWithChildren) => {
  const [conversations, setConversations] = useState<IConversations[]>([]);
  const [unReadConversations, setUnReadConversations] = useState<IConversations[]>([]);
  const { state } = usePopup();
  const { token } = useAuth();

  useEffect(() => {
    token !== "" && fetchConversations();
  }, [state.isOpenMessage]);

  const fetchConversations = useCallback(async () => {
    try {
      const result = await getConversations();
      setConversations(result.data);
      setUnReadConversations(result.data.filter((value) => value.lastMessage.seen === false));
    } catch (error: any) {
      toast.error(error.toString());
    }
  }, [token]);

  return (
    <conversationsContext.Provider value={{ conversations, unReadConversations, setConversations }}>
      {children}
    </conversationsContext.Provider>
  );
};

export const useConversations = () => {
  return useContext(conversationsContext);
};
