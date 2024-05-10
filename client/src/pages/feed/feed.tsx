import { GrNext, GrPrevious } from "react-icons/gr";
import Post from "../../components/Post";
import { useEffect, useRef, useState } from "react";
import { getFeedPosts } from "../../utils/apis/feed/api";
import toast from "react-hot-toast";
import { IFeedType } from "../../utils/apis/feed/types";
import { usePopup } from "../../utils/contexts/popup";
import { followUnFollowUser, getPeople, getUser } from "../../utils/apis/user/api";
import { IUser } from "../../utils/apis/user/types";
import defaultProfile from "../../../public/default-profile.jpeg";
import { Link } from "react-router-dom";
import SkeletonPost from "../../components/SkeletonPost";
import { useSocket } from "../../utils/contexts/socket";
import { useAuth } from "../../utils/contexts/auth";
import { FaCamera } from "react-icons/fa";
const Feed = () => {
  const { user } = useAuth();
  const { dispatch } = usePopup();
  const { onlineUsers } = useSocket();
  const [peoples, setPeoples] = useState<IUser[]>();
  const [usersData, setUsersData] = useState<IUser[]>();
  const [feedLoading, setFeedLoading] = useState(false);
  const slideRef = useRef<HTMLDivElement | null>(null);
  const [feedPosts, setFeedPosts] = useState<IFeedType[]>();
  const [scrollNavigation, setScrollNavigation] = useState({
    prev: false,
    next: false,
  });
  const [followUnfollowStatus, setFollowUnfollowStatus] = useState<string[]>([]);
  const [sizePage, setSizePage] = useState(1);
  const [stopScroll, setStopScroll] = useState(false);
  useEffect(() => {
    getFeed();
    fetchPeople();
  }, []);

  useEffect(() => {
    const scrollContainer = slideRef.current as HTMLDivElement;
    const updateScrollNavigation = () => {
      setScrollNavigation(() => ({
        prev: scrollContainer?.scrollLeft > 0,
        next:
          scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth,
      }));
    };

    scrollContainer?.addEventListener("scroll", updateScrollNavigation);
    return () => {
      scrollContainer?.removeEventListener("scroll", updateScrollNavigation);
    };
  }, []);
  useEffect(() => {
    if (stopScroll) return;

    const scroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY;

      if (scrollPosition + window.innerHeight >= scrollHeight) {
        getFeed();
      }
    };

    window.addEventListener("scroll", scroll);
    return () => {
      window.removeEventListener("scroll", scroll);
    };
  }, [feedLoading]);

  useEffect(() => {
    const fetchUsersData = async () => {
      const promisesData = onlineUsers.map(async (userId) => {
        const user = await getUser(userId);
        return user.data;
      });
      const dataUser = await Promise.all(promisesData);
      setUsersData(dataUser.filter((value) => value.followers.includes(user._id!)));
    };

    fetchUsersData();
  }, [onlineUsers]);

  const handlefollowUnFollowUser = async (userId: string) => {
    const filterStatus = followUnfollowStatus.find((value) => value === userId);
    if (!filterStatus) {
      setFollowUnfollowStatus((prev) => [...prev, userId]);
    } else {
      const deleteStatus = followUnfollowStatus.filter((value) => value !== userId);
      setFollowUnfollowStatus(deleteStatus);
    }
    try {
      const result = await followUnFollowUser(userId);
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
    }
  };

  const fetchPeople = async () => {
    try {
      const result = await getPeople();
      setPeoples(result?.data);
      result.data.map((value) => {
        setFollowUnfollowStatus((prev) => [...prev, value._id]);
      });
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  const getFeed = async () => {
    if (stopScroll) return;
    try {
      setFeedLoading(true);
      const result = await getFeedPosts(sizePage);
      if (!result.data.length) {
        setStopScroll(true);
      }
      !feedPosts?.length
        ? setFeedPosts(result.data)
        : setFeedPosts((prev: any) => [...prev, ...result.data]);
      setSizePage((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setFeedLoading(false);
    }
  };

  const handlePrev = () => {
    if (slideRef.current) {
      slideRef.current.scrollTo({ left: slideRef.current.scrollLeft - 84, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (slideRef.current) {
      slideRef.current.scrollTo({ left: slideRef.current.scrollLeft + 84, behavior: "smooth" });
    }
  };

  return (
    <main className=" flex justify-center gap-20 container">
      <div className="max-w-3xl w-full py-3 px-4 md:px-8 flex flex-col items-center gap-5">
        <div className="relative flex">
          <button
            hidden={!scrollNavigation.prev}
            className="p-2 rounded-full bg-slate-100 text-black dark:text-white dark:bg-slate-700 shadow-sm absolute left-2 top-1/2 -translate-y-1/2 z-10"
            onClick={handlePrev}
          >
            <GrPrevious />
          </button>
          <div className="flex items-center gap-x-5 overflow-hidden mx-7 py-3" ref={slideRef}>
            {Array.from({ length: 10 }, (_, index) => {
              if (index === 0) {
                return (
                  <button
                    key={index}
                    className="min-w-14 min-h-14 md:min-w-16 md:min-h-16 rounded-full border-[3px] bg-slate-100 dark:bg-blue-3 border-dashed border-slate-600 dark:border-slate-500 cursor-pointer duration-300 flex items-center justify-center text-slate-700 dark:text-white/80"
                    onClick={() => dispatch({ type: "SET_OPEN_POST_STATUS" })}
                  >
                    <FaCamera className=" size-7 " />
                  </button>
                );
              } else {
                return (
                  <img
                    key={index}
                    src={"https://source.unsplash.com/80x80?person"}
                    className="size-14 md:size-16 rounded-full border-[3px] border-slate-100 dark:border-slate-600 hover:scale-110 cursor-pointer duration-300"
                  />
                );
              }
            })}
          </div>

          <button
            hidden={scrollNavigation.next}
            className="p-2 rounded-full bg-slate-100 text-black dark:text-white dark:bg-slate-700 shadow-sm absolute right-2 top-1/2 -translate-y-1/2 z-10"
            onClick={handleNext}
          >
            <GrNext />
          </button>
        </div>
        <div className="rounded-xl p-5 flex items-center gap-3 w-full max-w-xl bg-slate-100 dark:bg-blue-3 shadow-lg">
          <button
            className="bg-slate-200 dark:bg-slate-700 rounded-lg p-3 text-slate-900 dark:text-white text-sm font-semibold w-full"
            onClick={() => dispatch({ type: "SET_OPEN_POST" })}
          >
            What do you have in mind?
          </button>
        </div>
        {feedPosts?.map((post) => (
          <Post key={post._id} post={post} refetchFeed={getFeed} postFeed />
        ))}
        {feedLoading && <SkeletonPost postFeed />}
      </div>
      <div className=" max-w-sm w-full my-8 space-y-12 hidden md:block">
        <div className="bg-slate-100 dark:bg-blue-3 p-5 min-w-full rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              People you may know
            </h3>
            <span className="text-blue-500 text-sm">See all</span>
          </div>
          {peoples?.map((user) => (
            <div key={user._id} className="flex items-center gap-4">
              <Link to={`/timeline/${user._id}`}>
                <img
                  src={user.profilePic ? user.profilePic : defaultProfile}
                  className="size-12 rounded-full object-cover"
                  alt="my-people"
                />
              </Link>
              <div className="flex flex-col gap-px flex-grow">
                <h4 className="font-semibold text-sm dark:text-white text-slate-900">
                  {user.name}
                </h4>
                <span className="text-black/55 dark:text-white/55 text-xs">
                  {user.followers?.length} Followers
                </span>
              </div>
              <button
                className="py-1.5 px-3 bg-blue-500 dark:bg-white/15 rounded-md text-xs font-semibold text-white"
                onClick={() => handlefollowUnFollowUser(user?._id)}
              >
                {followUnfollowStatus.includes(user._id) ? "Follow" : "Unfollow"}
              </button>
            </div>
          ))}
        </div>
        <div className="bg-slate-100 dark:bg-blue-3 p-5 min-w-full rounded-xl flex flex-col gap-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Online users</h3>
          <div className="py-3 flex gap-2.5 overflow-hidden">
            {usersData?.map((user) => {
              return (
                <div
                  key={user._id}
                  className="flex flex-col items-center text-center gap-2 max-w-16"
                >
                  <div className="relative">
                    <img
                      src={user.profilePic ? user.profilePic : defaultProfile}
                      alt="online-user-profile"
                      className="size-14 rounded-full object-cover"
                    />
                    <div className="absolute size-3 rounded-full bg-green-500 bottom-0 right-0"></div>
                  </div>
                  <span className="text-xs font-semibold capitalize line-clamp-1 dark:text-white text-slate-900">
                    {user.username}
                  </span>
                </div>
              );
            })}
            {!usersData?.length ? (
              <p className="text-sm font-semibold text-center w-full text-black/70 dark:text-white/70">
                No online users
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Feed;
