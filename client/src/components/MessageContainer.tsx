import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getConversationById, getMessages, sendMessage } from "../utils/apis/message/api";
import toast from "react-hot-toast";
import { IConversation, IConversations, IMessagePayload } from "../utils/apis/message/types";
import defaultProfile from "../../public/default-profile.jpeg";
import { useSocket } from "../utils/contexts/socket";
import { useAuth } from "../utils/contexts/auth";
import messageSound from "../../public/system-notification-199277.mp3";
import { MdDoneAll } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
interface MessageContainerProps {
  updateConversation(data: any): void;
  isOpenConversation: boolean;
  setIsopenConversatio(isOpen: boolean): void;
}
const MessageContainer = ({
  updateConversation,
  isOpenConversation,
  setIsopenConversatio,
}: MessageContainerProps) => {
  const [searchParams, _setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const conversationId = searchParams.get("conversation");
  const [conversation, setConversation] = useState<IConversation>();
  const { socket, onlineUsers } = useSocket();
  const [typeMessage, setTypeMessage] = useState("");
  const [messages, setMessages] = useState<IMessagePayload[]>();
  const { user } = useAuth();
  const containerChat = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket?.on("newMessage", (message: IMessagePayload) => {
      if (conversationId === message.conversationId) {
        setMessages((prev) => [...prev!, message]);
        updateConversation((prev: IConversations[]) => {
          const updatedConversations = prev.map((conversation: IConversations) => {
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
        if (!document.hasFocus()) {
          const sound = new Audio(messageSound);
          sound.play();
        }
      }
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, conversationId, conversation, messages]);

  useEffect(() => {
    if (!conversationId) return;
    const fetchConversation = async () => {
      try {
        const result = await getConversationById(conversationId as string);
        setConversation(result.data);
      } catch (error: any) {
        navigate("/messages");
        toast.error(error.toString());
      }
    };

    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    // if (!conversationId) return;
    const lastMessageIsFromOtherUser =
      messages?.length && messages[messages.length - 1].sender !== user._id;
    if (lastMessageIsFromOtherUser) {
      socket?.emit("markMessagesAsSeen", {
        conversationId: conversationId,
        userId: conversation?.participants[0]._id,
      });
    }
    socket?.on("messagesSeen", (message: { conversationId: string }) => {
      if (conversation?._id || conversationId === message.conversationId) {
        setMessages((prev: any) => {
          const updatedMessages = prev?.map((message: IMessagePayload) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, messages, conversation, conversationId]);

  useEffect(() => {
    if (!containerChat) return;
    const height = containerChat.current?.scrollHeight;
    containerChat.current?.scrollTo(0, height!);
  }, [messages]);

  useEffect(() => {
    if (!conversation) return;
    const fetchMessages = async () => {
      try {
        const result = await getMessages(conversation?.participants[0]?._id!);
        setMessages(result.data);
      } catch (error: any) {
        toast.error(error.toString());
      }
    };
    fetchMessages();
  }, [conversation, setConversation]);

  const handleSendMessage = async () => {
    if (!typeMessage) return;
    try {
      const result = await sendMessage({
        recipientId: conversation?.participants[0]._id!,
        message: typeMessage,
      });
      setMessages([...(messages as IMessagePayload[]), result.data]);
      setTypeMessage("");
    } catch (error: any) {
      toast.error(error.toString());
    }
  };
  return (
    <>
      {!searchParams.get("conversation") || !isOpenConversation ? (
        <div className="flex items-center justify-center h-full text-slate-900 dark:text-white">
          Select a conversation to start messaging
        </div>
      ) : (
        <div className="flex flex-col h-full ">
          <div className="p-4 border-b border-black/20 dark:border-white/20">
            <div className="flex items-center gap-4 ">
              <IoIosArrowBack
                className="hover:bg-black/20 dark:hover:bg-white/20 size-8 p-2 rounded-full bg-black/5 dark:bg-white/5 cursor-pointer dark:text-white text-slate-900"
                onClick={() => {
                  navigate("/messages");
                  setIsopenConversatio(false);
                }}
              />
              <img
                src={
                  conversation?.participants[0]?.profilePic
                    ? conversation?.participants[0].profilePic
                    : defaultProfile
                }
                alt="profile-user"
                className="size-11 rounded-full"
              />
              <div className="space-y-2">
                <h3 className="font-semibold dark:text-white text-slate-900">
                  {conversation?.participants[0]?.username}
                </h3>
                {onlineUsers.includes(conversation?.participants[0]._id!) ? (
                  <span className="text-xs text-green-500 font-semibold ">Online</span>
                ) : (
                  <span className="text-xs text-black/50 dark:text-white/50 font-semibold">
                    Offline
                  </span>
                )}
              </div>
            </div>
          </div>
          <div
            className="px-8 py-6 space-y-4 flex-1 overflow-y-auto scrollbar-chat "
            ref={containerChat}
          >
            {messages?.map((message) => (
              <div
                className={`flex gap-4 ${
                  message.sender !== user._id ? "justify-start" : "justify-end"
                }`}
                key={message._id}
              >
                {message.sender !== user._id && (
                  <img
                    src={
                      conversation?.participants[0]?.profilePic
                        ? conversation?.participants[0].profilePic
                        : defaultProfile
                    }
                    alt="proflie-user-chat"
                    className="rounded-full size-10"
                  />
                )}
                <div className="relative">
                  <p
                    className={`py-2 px-4 rounded-xl ${
                      message.sender === user._id
                        ? "bg-teal-500 text-white"
                        : " bg-slate-200 dark:bg-[#334150] text-slate-900 dark:text-white"
                    }  text-sm font-semibold  max-w-[500px]`}
                  >
                    {message?.text}
                  </p>

                  {message.sender === user._id ? (
                    <MdDoneAll
                      className={`${
                        message.seen ? "text-sky-500" : "text-white"
                      } absolute bottom-1 -right-5 size-4`}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="py-3 px-4 flex gap-2 items-center bg-black/10">
            <textarea
              className="w-full text-sm py-2 px-4 bg-slate-100 dark:bg-[#334150] rounded-full border-none outline-none placeholder:font-medium placeholder:text-slate-900 dark:placeholder:text-white resize-none dark:text-white text-slate-900"
              rows={1}
              placeholder="Write your message"
              onChange={(e) => setTypeMessage(e.target.value)}
              onKeyDown={(e) => {
                e.key === "Enter" && handleSendMessage();
              }}
              value={typeMessage}
            />
            <button className="bg-blue-500 py-2 px-4 rounded-full" onClick={handleSendMessage}>
              <BiSend className=" size-5 cursor-pointer " />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageContainer;
