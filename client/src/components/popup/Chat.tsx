import { useEffect, useRef, useState } from "react";
import { PopupAction } from "../../utils/reducers/types";
import { useConversations } from "../../utils/contexts/conversations";
import { IConversations, IMessagePayload } from "../../utils/apis/message/types";
import defaultProfile from "../../../public/default-profile.jpeg";
import { getMessages, sendMessage } from "../../utils/apis/message/api";
import toast from "react-hot-toast";
import { useSocket } from "../../utils/contexts/socket";
interface PopupProfileProps {
  isOpenChat: boolean;
  dispatch: React.Dispatch<PopupAction>;
}

const Chat = ({ isOpenChat, dispatch }: PopupProfileProps) => {
  console.log("RENDER POPUP CHAT");

  const popupRef = useRef<any>();
  const msgContainerRef = useRef<any>();
  const { conversations, setConversations } = useConversations();
  const [toUserChat, setToUserChat] = useState<IConversations>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessagePayload[]>([]);
  const [isSending, setIsSending] = useState(false);
  const { socket } = useSocket();
  const handleClose = (e: any) => {
    if (popupRef.current && !popupRef.current.contains(e.target) && e.target.id !== "popup-chat") {
      dispatch({ type: "SET_CLOSE_CHAT" });
      setConversations((prev) => prev.filter((value) => value.mock !== true));
    }
  };
  const handleSendMessage = async () => {
    if (!message) return;
    try {
      const result = await sendMessage({
        message: message,
        recipientId: toUserChat?.participants[0]._id!,
      });
      setMessages([...(messages as IMessagePayload[]), result.data]);
      setIsSending(true);
      setMessage("");
    } catch (error: any) {
      setIsSending(false);
      toast.error(error.toString());
    }
  };

  useEffect(() => {
    setToUserChat(conversations.find((value: any) => value.mock === true));
  }, [isOpenChat]);

  useEffect(() => {
    socket?.on("newMessage", (message: IMessagePayload) => {
      if (toUserChat?._id === message.conversationId) {
        setMessages([...(messages as IMessagePayload[]), message]);
      }
    });

    // const height = msgContainerRef.current?.scrollHeight;
    // msgContainerRef.current?.scrollTo(0, height!);

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, toUserChat, conversations, messages]);

  useEffect(() => {
    if (!isSending || !conversations.length) return;
    const fetchMessages = async () => {
      try {
        const result = await getMessages(toUserChat?.participants[0]?._id!);
        setMessages(result.data);
      } catch (error: any) {
        toast.error(error.toString());
      }
    };
    fetchMessages();
  }, [toUserChat, toUserChat, isOpenChat]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  if (!isOpenChat) return;

  return (
    <div
      className=" fixed max-w-sm w-full rounded-t-xl max-h-96 h-full bottom-0 right-28 bg-slate-700 text-white z-50 flex flex-col"
      ref={popupRef}
      id="popup-chat"
    >
      <div className="flex gap-2 p-3">
        <img
          src={
            toUserChat?.participants[0].profilePic
              ? toUserChat.participants[0].profilePic
              : defaultProfile
          }
          className="rounded-full size-10"
          alt="profile-chat"
        />
        <span className="text-sm ">{toUserChat?.participants[0]?.username}</span>
      </div>
      <div
        className="flex-1 bg-slate-600 overflow-y-auto p-4 space-y-3 flex flex-col scrollbar-chat"
        ref={msgContainerRef}
      >
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`bg-slate-500 rounded-md py-1 px-3 max-w-52 text-sm ${
              msg.sender === toUserChat?.participants[0]._id ? "self-start" : "self-end"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="w-full py-1 px-2 bg-transparent">
        <input
          type="text"
          className="rounded-full text-sm border-none outline-none w-full h-full px-3 py-2 bg-slate-600"
          placeholder="Write message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={(e) => {
            e.key === "Enter" && handleSendMessage();
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
