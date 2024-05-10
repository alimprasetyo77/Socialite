import { FcLike } from "react-icons/fc";
import defaultProfile from ".././../../public/default-profile.jpeg";
import { FaCommentDots } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { MdOutlineIosShare } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { distanceToNow } from "../../utils/formatter";
import toast from "react-hot-toast";
import { getPost, likeUnlike, reply } from "../../utils/apis/post/api";
import { IFeedType } from "../../utils/apis/feed/types";
import { getUser } from "../../utils/apis/user/api";
import { IUser } from "../../utils/apis/user/types";
import { PopupAction } from "../../utils/reducers/types";
import { useAuth } from "../../utils/contexts/auth";
import { BsX } from "react-icons/bs";

interface DetailPostProps {
  postId: string | null;
  dispatch: React.Dispatch<PopupAction>;
}

const DetailPost = ({ dispatch, postId }: DetailPostProps) => {
  const { user } = useAuth();
  const [replyMsg, setReplyMsg] = useState("");
  const detailPostRef = useRef<any>();
  const [post, setPost] = useState<IFeedType | null>();
  const [usersData, setUsersData] = useState<IUser | null>();

  const handleCloseDetailPost = (e: any) => {
    if (detailPostRef.current && !detailPostRef.current.contains(e.target)) {
      dispatch({ type: "SET_CLOSE_DETAIL_POST" });
      setPost(null);
      setUsersData(null);
    }
  };

  const handleReplyPost = async () => {
    if (!replyMsg) return;
    try {
      const result = await reply(replyMsg, post!._id);
      toast.success(result.message);
      setReplyMsg("");
      fetchDetailPost();
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  const handleLike = async () => {
    try {
      const result = await likeUnlike(post!._id);
      toast.success(result!.message);
      fetchDetailPost();
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  const fetchDetailPost = async () => {
    try {
      const resultPost = await getPost(postId as string);
      const resultUser = await getUser(resultPost.data.postedBy);
      setPost(resultPost.data);
      setUsersData(resultUser.data);
    } catch (error: any) {
      toast.error(error.toString());
    }
  };
  useEffect(() => {
    if (!postId) return;
    fetchDetailPost();
  }, [postId]);

  useEffect(() => {
    document.addEventListener("mousedown", handleCloseDetailPost);
    return () => {
      document.removeEventListener("mousedown", handleCloseDetailPost);
    };
  }, []);

  if (!postId) return;
  return (
    <div className="fixed inset-0 z-[52] bg-white/5 backdrop-blur-sm flex items-center justify-center p-20">
      <div
        className="shadow-sm w-full h-full rounded-xl bg-white dark:bg-blue-3 flex flex-col lg:flex-row items-center justify-center overflow-y-auto lg:overflow-hidden"
        ref={detailPostRef}
      >
        <div className="flex-1 min-h-full h-full">
          <img
            src={post?.img}
            alt="image-post"
            className="object-fill object-center w-full h-full"
          />
        </div>
        <div className="lg:max-w-96 w-full h-full p-5 space-y-4 flex flex-col">
          <div className="flex justify-between ">
            <div className="flex gap-2 ">
              <img
                src={usersData ? usersData.profilePic : defaultProfile}
                alt="Profile"
                className="size-10 rounded-full"
              />
              <div className="flex flex-col gap-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {usersData?.name}
                </h4>
                <span className="text-[11px] font-semibold text-black/30 dark:text-white/30">
                  {distanceToNow(post?.createdAt as string)}
                </span>
              </div>
            </div>
            <BsX
              className="text-slate-900 dark:text-white size-7 cursor-pointer"
              onClick={() => dispatch({ type: "SET_CLOSE_DETAIL_POST" })}
            />
          </div>
          <p className="text-sm tracking-wide leading-relaxed text-slate-900 dark:text-white">
            {post?.text}
          </p>
          <div className="flex justify-between  gap-3 w-full text-slate-900 dark:text-white">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <button
                  className="bg-black/15 dark:bg-white/15 flex items-center justify-center rounded-full size-8"
                  onClick={() => handleLike()}
                >
                  <FcLike className="size-4" />
                </button>
                <span className="text-[13px] font-semibold">{post?.likes.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-black/15 dark:bg-white/15 flex items-center justify-center rounded-full size-8">
                  <FaCommentDots className="size-4" />
                </button>
                <span className="text-[13px] font-semibold">{post?.replies.length}</span>
              </div>
            </div>
            <div className="flex gap-5">
              <button className="bg-black/15 dark:bg-white/15 flex items-center justify-center rounded-full size-8">
                <IoIosSend className="size-4" />
              </button>
              <button className="bg-black/15 dark:bg-white/15 flex items-center justify-center rounded-full size-8">
                <MdOutlineIosShare className="size-4" />
              </button>
            </div>
          </div>
          <div
            className={`flex flex-col w-full gap-3  border-t border-b border-black/5 dark:border-white/5 py-3 text-white overflow-y-auto scrollbar-chat ${
              !post?.replies.length && "hidden"
            }`}
          >
            {post?.replies.map((reply) => (
              <>
                <div className="flex gap-2.5 " key={reply.id}>
                  <img
                    src={reply.userProfilePic ? reply.userProfilePic : defaultProfile}
                    className="size-8 rounded-full "
                    alt="comment-profile"
                  />
                  <div className="flex flex-col bg-slate-100 dark:text-white text-slate-900 dark:bg-slate-700/80 py-1 px-3 rounded-lg">
                    <span className="text-sm font-semibold">{reply.name}</span>
                    <p className="text-sm font-medium tracking-wide">{reply.text}</p>
                  </div>
                </div>
              </>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full  duration-300 transition-all text-slate-900 dark:text-white">
            <img
              src={user ? user.profilePic : defaultProfile}
              alt="current-profile"
              className="size-8 rounded-full"
            />
            <textarea
              className="grow text-slate-900 dark:text-white  font-medium py-2 px-3  w-full rounded-lg bg-slate-100 dark:bg-slate-700/80 text-sm outline-none resize-none overflow-hidden "
              placeholder="Add Comment..."
              rows={1}
              aria-expanded={true}
              value={replyMsg}
              onChange={(e) => setReplyMsg(e.target.value)}
              onKeyDown={(e) => {
                e.key === "Enter" && handleReplyPost();
              }}
            />
            <button
              className={`py-2.5 px-3 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/15 `}
              onClick={handleReplyPost}
            >
              Replay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPost;
