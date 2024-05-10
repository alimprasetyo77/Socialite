import { BiSearch } from "react-icons/bi";
import MessageContainer from "../../components/MessageContainer";
import { useSearchParams } from "react-router-dom";
import Conversation from "../../components/Conversation";
import toast from "react-hot-toast";
import { getConversations } from "../../utils/apis/message/api";
import { useEffect, useState } from "react";
import { IConversations } from "../../utils/apis/message/types";
import { useSocket } from "../../utils/contexts/socket";

const Messages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<IConversations[]>();
  const { onlineUsers } = useSocket();
  const [isOpenConversation, setIsOpenConversation] = useState(false);
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    fetchConversations();
  }, []);
  useEffect(() => {
    if (!keyword) fetchConversations();
  }, [keyword]);

  const handleSearch = () => {
    if (!keyword) fetchConversations();
    setConversations((prev) => {
      const filter = prev?.filter((value) =>
        value.participants[0].username.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
      );
      if (!filter) {
        setKeyword("");
        return;
      }
      return filter;
    });
  };

  const onClickConversations = (tab: string) => {
    searchParams.set("conversation", String(tab));
    setSearchParams(searchParams);
    setIsOpenConversation(true);
  };
  const fetchConversations = async () => {
    try {
      const result = await getConversations();
      setConversations(result.data);
    } catch (error: any) {
      toast.error(error.toString());
    }
  };
  return (
    <div className="flex w-full min-h-[calc(100vh-70px)] dark:bg-transparent bg-slate-100">
      <div
        className={`w-full lg:w-96 h-full max-h-screen lg:max-h-[calc(100vh-70px)] overflow-hidden ${
          isOpenConversation ? "hidden lg:block" : "block"
        } `}
      >
        <h1 className="text-lg font-bold text-slate-900 dark:text-white p-4">Chats</h1>
        <div className="relative px-3 text-slate-900 dark:text-white">
          <input
            type="text"
            className="w-full rounded-lg bg-black/10 dark:bg-white/10 outline-none border-none pl-10 py-2 text-sm font-semibold placeholder:text-black/90 dark:placeholder:text-white/90"
            placeholder="Search"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" && handleSearch();
            }}
          />
          <BiSearch className="absolute left-7 top-1/2 -translate-y-1/2 " />
        </div>
        <div className=" p-2 h-full overflow-y-auto scrollbar-chat space-y-2">
          {conversations?.map((conversation) => (
            <Conversation
              key={conversation._id}
              isOnline={onlineUsers.includes(conversation?.participants[0]?._id)}
              data={conversation}
              onAction={onClickConversations}
              selected={searchParams.get("conversation") === conversation._id}
            />
          ))}
        </div>
      </div>

      <div
        className={`flex-1 overflow-hidden max-h-[calc(100vh-70px)] ${
          isOpenConversation ? "block " : "hidden lg:block"
        }`}
      >
        <MessageContainer
          updateConversation={setConversations}
          isOpenConversation={isOpenConversation}
          setIsopenConversatio={setIsOpenConversation}
        />
      </div>
    </div>
  );
};

export default Messages;
