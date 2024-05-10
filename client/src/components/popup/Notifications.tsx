import { memo, useEffect, useRef } from "react";
import { PopupAction } from "../../utils/reducers/types";
import { BiDotsHorizontal } from "react-icons/bi";
import Notification from "../Notification";
import { useNotification } from "../../utils/contexts/notification";
import { useSocket } from "../../utils/contexts/socket";
import { useAuth } from "../../utils/contexts/auth";

interface PopNotificationsProps {
  isOpenNotification: boolean;
  dispatch: React.Dispatch<PopupAction>;
}
const Notifications = memo<PopNotificationsProps>(({ isOpenNotification, dispatch }) => {
  console.log("RENDER POPUP NOTIFICATIONS");

  const notifRef = useRef<any>();
  const { notifications, unreadNotifications } = useNotification();
  const { socket } = useSocket();
  const { user } = useAuth();
  const handleClose = (e: any) => {
    if (
      notifRef.current &&
      !notifRef.current.contains(e.target) &&
      e.target.id !== "notifications" &&
      e.target.nodeName !== "path"
    ) {
      dispatch({ type: "SET_CLOSE_NOTIF" });
    }
  };

  useEffect(() => {
    if (unreadNotifications.length !== 0) {
      socket?.emit("markNotificationsRead", {
        userId: user._id,
      });
    }
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  if (!isOpenNotification) return;
  return (
    <div
      className="fixed inset-x-0 md:inset-x-auto top-16 md:right-36 max-w-full md:max-w-[365px] w-full rounded-xl bg-white dark:bg-slate-700  z-[51]"
      ref={notifRef}
    >
      <div className="bg-white dark:bg-slate-700 size-4 absolute -top-1 right-5 rotate-45"></div>
      <div className="flex p-4 items-center justify-between">
        <h3 className="text-xl font-bold  text-slate-900 dark:text-white">Notifications</h3>
        <BiDotsHorizontal className="text-slate-900 dark:text-white size-5" />
      </div>
      {!notifications.length ? (
        <p className="text-xs text-center text-black/70 dark:text-white/70 p-4 font-semibold">
          Notification not found
        </p>
      ) : (
        <>
          <div className="px-3 overflow-y-auto scrollbar-chat h-full max-h-96">
            {notifications.slice(0, 10).map((notification) => (
              <Notification data={notification} key={notification._id} />
            ))}
          </div>
          <div className="p-4 text-sm font-semibold text-slate-900 dark:text-white text-center">
            See all notifications
          </div>
        </>
      )}
    </div>
  );
});

export default Notifications;
