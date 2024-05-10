import { memo, useEffect, useRef } from "react";
import { BiMoon } from "react-icons/bi";
import { LuLogOut } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../utils/apis/auth/api";
import toast from "react-hot-toast";
import default_profile from "../../../public/default-profile.jpeg";
import { IUser } from "../../utils/apis/user/types";
import { PopupAction } from "../../utils/reducers/types";
import { useAuth } from "../../utils/contexts/auth";

interface PopupProfileProps {
  isOpenProfile: boolean;
  user: Partial<IUser>;
  changeToken: () => void;
  dispatch: React.Dispatch<PopupAction>;
}

const PopupProfile = memo<PopupProfileProps>(({ dispatch, isOpenProfile, user, changeToken }) => {
  console.log("RENDER POPUP PROFILE");
  const navigate = useNavigate();
  const popupRef = useRef<any>();
  const { toggleTheme } = useAuth();

  const handleClose = (e: any) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target) &&
      e.target.alt !== "profile-image"
    ) {
      dispatch({ type: "SET_CLOSE_PROFILE" });
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);
  const handleLogout = async () => {
    try {
      const result = await logout();
      toast.success(result.message);
      changeToken();
      navigate("/login");
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  if (!isOpenProfile) return;

  return (
    <div
      ref={popupRef}
      className="fixed right-10 top-16 z-[100] min-w-[256px]  p-4  rounded-lg shadow-sm dark:bg-slate-700 bg-white space-y-3 dark:text-white text-slate-900"
    >
      <Link to={`/timeline/${user._id}`} className="flex items-center gap-3">
        <img
          src={user.profilePic ? user.profilePic : default_profile}
          className="size-10 rounded-full object-cover "
          alt="profile"
        />

        <div className="flex flex-col gap-px">
          <h3 className="text-sm font-semibold dark:text-white text-slate-900">{user.name}</h3>
          <span className="text-sm dark:text-slate-300 text-slate-700">@{user.username}</span>
        </div>
      </Link>
      <div className="h-px bg-white/15 w-full"></div>
      <Link
        to={"/setting"}
        onClick={() => dispatch({ type: "SET_CLOSE_PROFILE" })}
        className="flex items-center gap-3 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 py-1.5 px-3"
      >
        <CiSettings className="size-6" />
        <span className="text-sm font-medium">My Account</span>
      </Link>
      <div
        className="flex items-center gap-3 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 py-1.5 px-3"
        onClick={toggleTheme}
      >
        <BiMoon className="size-6" />
        <span className="text-sm font-medium">Night mode</span>
      </div>
      <div className="h-px bg-white/15 w-full"></div>
      <button
        onClick={() => {
          handleLogout();
          dispatch({ type: "SET_CLOSE_PROFILE" });
        }}
        className="flex items-center gap-3 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 py-1.5 px-3 w-full"
      >
        <LuLogOut className="size-6" />
        <span className="text-sm font-medium">Log Out</span>
      </button>
    </div>
  );
});

export default PopupProfile;
