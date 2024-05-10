import { IConversations } from "../utils/apis/message/types";
import defaultProfile from "../../public/default-profile.jpeg";
interface ConversationProps {
  data: IConversations;
  onAction(id: string): void;
  selected: boolean;
  isOnline: boolean;
}
const Conversation = ({ data, onAction, selected, isOnline }: ConversationProps) => {
  return (
    <div
      key={data._id}
      className={`flex items-center gap-3 hover:bg-black/10 dark:hover:bg-white/10 ${
        selected && "bg-black/10 dark:bg-white/10"
      } rounded-lg p-2 cursor-pointer `}
      onClick={() => onAction(data._id.toString())}
    >
      <div className="relative">
        <img
          src={data.participants[0]?.profilePic ? data.participants[0].profilePic : defaultProfile}
          alt="chat-user"
          className="size-[60px] min-w-[60px] rounded-full "
        />
        {isOnline ? (
          <div className="absolute bottom-1 right-1 size-3 bg-green-500 rounded-full"></div>
        ) : null}
      </div>
      <div className="space-y-1 ">
        <span className="font-bold text-sm text-slate-900 dark:text-white">
          {data.participants[0]?.username}
        </span>
        <p className="text-xs font-semibold text-black/80 dark:text-white/80 line-clamp-1">
          {data.lastMessage?.text}
        </p>
      </div>
    </div>
  );
};

export default Conversation;
