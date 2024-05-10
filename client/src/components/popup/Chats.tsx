import { BiSearch } from "react-icons/bi";
import { PopupAction } from "../../utils/reducers/types";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IConversations, IMessagePayload } from "../../utils/apis/message/types";
import { getConversations } from "../../utils/apis/message/api";
import toast from "react-hot-toast";
import defaultProfile from "../../../public/default-profile.jpeg";
import { useSocket } from "../../utils/contexts/socket";
import { useConversations } from "../../utils/contexts/conversations";

interface PopupProfileProps {
  isOpenChat: boolean;
  dispatch: React.Dispatch<PopupAction>;
}
const Chats = ({ isOpenChat, dispatch }: PopupProfileProps) => {
  console.log("RENDER POPUP CHATS");

  const popupRef = useRef<any>();
  const { conversations, setConversations } = useConversations();
  const { socket } = useSocket();
  const [keyword, setKeyword] = useState("");

  const handleClose = (e: any) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target) &&
      e.target.id !== "history-chats" &&
      e.target.nodeName !== "path"
    ) {
      dispatch({ type: "SET_CLOSE_MSG" });
    }
  };

  useEffect(() => {
    socket?.on("newMessage", (message: IMessagePayload) => {
      setConversations((prev: any) => {
        const updatedConversations = prev?.map((conversation: IConversations) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [socket, isOpenChat]);

  useEffect(() => {
    fetchConversations();
  }, [isOpenChat]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  useEffect(() => {
    if (!keyword) fetchConversations();
  }, [keyword]);

  const handleSearch = () => {
    if (!keyword) fetchConversations();
    setConversations((prev: any) => {
      const filter = prev?.filter((value: any) =>
        value.participants[0].username.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
      );
      if (!filter) {
        setKeyword("");
        return;
      }
      return filter;
    });
  };

  const fetchConversations = async () => {
    try {
      const result = await getConversations();
      setConversations(result.data);
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  if (!isOpenChat) return;
  return (
    <div
      className="fixed inset-x-0 md:inset-x-auto  top-16 md:right-20 z-[51] w-full max-w-full md:max-w-[360px] rounded-xl bg-white dark:bg-slate-700 min-h-72"
      ref={popupRef}
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white p-4">Chats</h3>
      <div className="relative px-3 text-white">
        <input
          type="text"
          className="w-full rounded-lg bg-slate-100 dark:bg-white/10 outline-none border-none pl-10 py-2 text-sm font-semibold placeholder:text-slate-700 dark:text-white text-slate-900 dark:placeholder:text-white/90"
          placeholder="Search"
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && handleSearch();
          }}
        />
        <BiSearch className="absolute left-7 top-1/2 -translate-y-1/2 dark:text-slate-700 text-slate-900" />
      </div>
      <div className="overflow-y-scroll h-80 p-2 scrollbar-chat">
        {conversations?.map((conversation) => (
          <Link
            to={`/messages?conversation=${conversation._id}`}
            key={conversation._id}
            className="flex items-center gap-3 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg p-2 cursor-pointer"
          >
            <img
              src={
                conversation.participants[0]?.profilePic
                  ? conversation.participants[0].profilePic
                  : defaultProfile
              }
              alt="chat-user"
              className="size-11 rounded-full"
            />
            <div className="space-y-1">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {conversation?.participants[0]?.username}
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-white/80">
                {conversation?.lastMessage.text}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="p-4 text-center text-sm font-semibold text-white border-t border-white/20">
        <Link to={"/messages"}>See all messages</Link>
      </div>
    </div>
  );
};

export default Chats;
