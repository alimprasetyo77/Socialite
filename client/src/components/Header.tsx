import { BiPlus, BiSearch, BiSolidBell, BiSolidMessageDetail } from "react-icons/bi";
import { usePopup } from "../utils/contexts/popup";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/contexts/auth";
import default_profile from "../../public/default-profile.jpeg";
import { searchUser } from "../utils/apis/user/api";
import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { ISearchUser } from "../utils/apis/user/types";
import defaultImageUser from "../../public/default-profile.jpeg";
import { debounce } from "../utils/formatter";
import { useNotification } from "../utils/contexts/notification";
import { IoMenu } from "react-icons/io5";
import { BsX } from "react-icons/bs";
const Header = () => {
  const { state, dispatch } = usePopup();
  const { user, theme } = useAuth();
  const { unreadNotifications } = useNotification();
  const [suggestionUser, setSuggestionUser] = useState<ISearchUser[]>();
  const [isOpenSuggest, setIsOpenSuggest] = useState(false);
  const suggestPopup = useRef<HTMLDivElement>(null);

  const handlePopupProfile = () => {
    if (!state.isOpenProfile) {
      dispatch({ type: "SET_OPEN_PROFILE" });
    } else {
      dispatch({ type: "SET_CLOSE_PROFILE" });
    }
  };
  const handlePopupMessage = () => {
    if (!state.isOpenMessage) {
      dispatch({ type: "SET_OPEN_MSG" });
    } else {
      dispatch({ type: "SET_CLOSE_MSG" });
    }
  };
  const handlePopupNotif = () => {
    if (!state.isOpenNotification) {
      dispatch({ type: "SET_OPEN_NOTIF" });
    } else {
      dispatch({ type: "SET_CLOSE_NOTIF" });
    }
  };
  const getSuggestion = async (keyword: string) => {
    if (!keyword) {
      setSuggestionUser([]);
      return;
    }
    try {
      const result = await searchUser(keyword);
      setIsOpenSuggest(true);
      setSuggestionUser(result?.data);
    } catch (error: any) {
      toast.error(error.toString());
    }
  };
  const getSuggestionsDebounce = useMemo(() => debounce(getSuggestion, 500), [getSuggestion]);

  const handleSearchUser = async (e: any) => {
    getSuggestionsDebounce(e.target.value);
  };

  const handleClose = (e: any) => {
    if (
      suggestPopup.current &&
      !suggestPopup.current.contains(e.target) &&
      e.target.id !== "search-input"
    ) {
      setIsOpenSuggest(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);
  return (
    <header className="py-3 px-3 md:px-5 lg:px-10 flex items-center justify-between dark:bg-[#1E293B] bg-white backdrop-blur-xl sticky top-0 inset-x-0 z-50">
      {/* Destop */}
      <Link to={"/"} className="hidden lg:block">
        {theme === "dark" ? (
          <img
            src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo-light.png"
            alt="logo-desktop"
          />
        ) : (
          <img
            src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo.png"
            alt="logo-desktop"
          />
        )}
      </Link>

      {/* Mobile */}
      <div className="flex items-center gap-3 lg:hidden">
        {state.isOpenSidebar ? (
          <BsX
            className="size-8 text-slate-900 dark:text-white"
            onClick={() => dispatch({ type: "SET_CLOSE_SIDEBAR" })}
          />
        ) : (
          <IoMenu
            className="size-8 text-slate-900 dark:text-white"
            onClick={() => dispatch({ type: "SET_OPEN_SIDEBAR" })}
          />
        )}
        <Link
          to={"/"}
          className="text-lg tracking-wide font-semibold text-slate-900 dark:text-white"
        >
          Socialite
        </Link>
      </div>

      <div className="w-[680px] rounded-xl relative bg-slate-100  dark:bg-white/5 hidden lg:block">
        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-900 dark:text-white " />
        <input
          id="search-input"
          type="text"
          className="pl-10 w-full p-3 text-slate-900 dark:text-white bg-transparent text-sm border-none outline-none focus:bg-black/5 dark:focus:bg-[#334155]/50 rounded-xl"
          placeholder="Search Friends"
          onChange={handleSearchUser}
        />
        <div
          className={`bg-white dark:bg-[#334155] w-full absolute rounded-md top-12 py-3 px-4 ${
            isOpenSuggest ? "block" : "hidden"
          }`}
          ref={suggestPopup}
        >
          {suggestionUser?.map((user) => (
            <Link
              to={`/timeline/${user._id}`}
              onClick={() => setIsOpenSuggest(false)}
              className="flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/10 p-2 cursor-pointer rounded-lg"
            >
              <img
                src={user.profilePic ? user.profilePic : defaultImageUser}
                alt="profile-users"
                className="rounded-full size-11"
              />
              <h4 className="font-bold text-slate-900 dark:text-white text-[13px]">{user.name}</h4>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative size-8 min-w-8 md:size-10 rounded-full bg-slate-100 dark:bg-white/10 cursor-pointer">
          <BiPlus className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-700 dark:text-white size-5 md:size-6 text-white/80" />
        </div>
        <div
          className="relative size-8 min-w-8 md:size-10 rounded-full bg-slate-100 dark:bg-white/10 cursor-pointer"
          onClick={handlePopupNotif}
          id="notifications"
        >
          <BiSolidBell
            id="notifications"
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  size-5 md:size-6 text-slate-700 dark:text-white/80"
          />
          <span
            className="absolute -top-1 -right-1 size-4 text-xs text-center font-semibold text-white  rounded-full bg-red-500 "
            hidden={!unreadNotifications.length}
            id="notifications"
          >
            {unreadNotifications.length}
          </span>
        </div>
        <button
          className="relative size-8 min-w-8 md:size-10 rounded-full bg-slate-100 dark:bg-white/10 cursor-pointer"
          onClick={handlePopupMessage}
          id="history-chats"
        >
          <BiSolidMessageDetail className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  size-5 md:size-6 text-slate-700 dark:text-white/80" />
        </button>

        <img
          src={user.profilePic ? user.profilePic : default_profile}
          className="size-10 rounded-full cursor-pointer object-cover object-center"
          alt="profile-image"
          onClick={handlePopupProfile}
        />
      </div>
    </header>
  );
};

export default Header;
