import { INotification } from "../utils/apis/notification/types";
import { distanceToNow } from "../utils/formatter";
import defaultProfile from "../../public/default-profile.jpeg";

interface NotificationProps {
  data: INotification;
}

const Notification = ({ data }: NotificationProps) => {
  return (
    <div
      className={`flex gap-3 cursor-pointer hover:bg-black/10 dark:hover:bg-white/15 ${
        !data.read ? "bg-white/10" : null
      } p-3 rounded-lg`}
    >
      <img
        src={data.senderId.profilePic ? data.senderId.profilePic : defaultProfile}
        alt="notif-profile-user"
        className="size-12 rounded-full object-center object-fill"
      />
      <div className="flex flex-col justify-around relative w-full">
        <p className="text-slate-900 dark:text-white text-sm line-clamp-2">
          <span className="font-bold">{data.senderId.name} </span>
          {data.type === "like"
            ? `Liked your post ${data.post?.text}`
            : data.type === "follow"
            ? `Started following you 🤙`
            : data.message}
        </p>
        <span className="text-xs font-semibold text-black/50 dark:text-white/50">
          {distanceToNow(data.createdAt.toString())}
        </span>
        {!data.read ? (
          <span className="absolute -right-1 top-0 size-2 rounded-full bg-green-500"></span>
        ) : null}
      </div>
    </div>
  );
};

export default Notification;
