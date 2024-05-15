import { Link, useLocation } from "react-router-dom";
import { usePopup } from "../utils/contexts/popup";
import { useEffect, useRef } from "react";

const content = [
  {
    title: "Feed",
    image: "https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/home.png",
    location: "/",
  },
  {
    title: "Messages",
    image: "https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/message.png",
    location: "/messages",
  },
  // {
  //   title: "Video",
  //   image: "https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/video.png",
  //   location: "/video",
  // },
  // {
  //   title: "Market",
  //   image: "https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/market.png",
  //   location: "/markets",
  // },
];

const LeftSidebar = () => {
  const location = useLocation();
  const { state, dispatch } = usePopup();
  const sidebarRef = useRef<any>();
  useEffect(() => {
    const closeSidebar = (e: any) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        dispatch({ type: "SET_CLOSE_SIDEBAR" });
      }
    };
    document.addEventListener("mousedown", closeSidebar);
    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, []);

  return (
    <div
      className={` z-[19] top-[64px]  ${
        state.isOpenSidebar
          ? "block  fixed bg-slate-100 dark:bg-slate-700 lg:sticky lg:bg-slate-50 dark:lg:bg-blue-primary"
          : "hidden sticky bg-slate-50 dark:bg-blue-primary"
      } lg:block w-72 h-[calc(100vh-64px)] p-2  space-y-1`}
      ref={sidebarRef}
    >
      {content.map((value, index) => (
        <Link
          to={value.location}
          key={index}
          className={`py-3 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-[#334150] text-slate-900 dark:text-white   cursor-pointer flex items-center gap-x-6 duration-300 ${
            value.location === location.pathname
              ? "bg-slate-200 dark:bg-[#334150]"
              : "bg-transparent"
          }`}
        >
          <img src={value.image} alt="icon-feed" className="size-6" />
          <span className="text-sm font-[550]">{value.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default LeftSidebar;
