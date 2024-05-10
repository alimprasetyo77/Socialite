import { CgMore } from "react-icons/cg";
import { FaAngleDown, FaCommentDots } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { IoIosSend } from "react-icons/io";
import { MdOutlineIosShare } from "react-icons/md";
import { IFeedType } from "../utils/apis/feed/types";
import { useEffect, useRef, useState } from "react";
import { IUser } from "../utils/apis/user/types";
import { getUser } from "../utils/apis/user/api";
import toast from "react-hot-toast";
import { distanceToNow } from "../utils/formatter";
import { useAuth } from "../utils/contexts/auth";
import default_profile from "../../public/default-profile.jpeg";
import { reply, likeUnlike, DeletePost } from "../utils/apis/post/api";
import PopupOptionPost from "./popup/OptionPost";
import { Link } from "react-router-dom";
import { usePopup } from "../utils/contexts/popup";
interface PostProps {
  post: IFeedType;
  refetchFeed: () => void;
  postFeed: boolean;
}

const Post = ({ post, refetchFeed, postFeed }: PostProps) => {
  const { user } = useAuth();
  const [dataUserPost, setDataUserPost] = useState<IUser>();
  const [replyMsg, setReplyMsg] = useState("");
  const [popupDeleteId, setPopupDeleteId] = useState<string | null>(null);
  const moreButtonRef = useRef<any>(null);
  const { dispatch } = usePopup();

  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const result = await getUser(post.postedBy);
        setDataUserPost(result?.data);
      } catch (error: any) {
        toast.error(error.toString());
      }
    };
    fetchDataUser();
  }, [post.postedBy]);

  const handleLike = async () => {
    try {
      const result = await likeUnlike(post._id);
      toast.success(result!.message);
      refetchFeed!();
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  const handleReplyPost = async () => {
    if (!replyMsg) return;
    try {
      const result = await reply(replyMsg, post._id);
      toast.success(result.message);
      setReplyMsg("");
      refetchFeed!();
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const result = await DeletePost(id);
      setPopupDeleteId(null);
      toast.success(result.message);
      refetchFeed();
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  const handlePopupMoreOption = (id: string) => {
    if (!popupDeleteId || popupDeleteId !== id) {
      setPopupDeleteId(id);
    } else {
      setPopupDeleteId(null);
    }
  };

  return (
    <>
      <div
        className={`rounded-xl p-5 flex flex-col  items-center gap-3 w-full ${
          postFeed ? "max-w-xl" : ""
        }  bg-slate-100 dark:bg-blue-3 shadow-lg`}
      >
        <div className="flex items-center gap-3 w-full relative">
          <Link to={`/timeline/${dataUserPost?._id}`}>
            <img
              src={dataUserPost?.profilePic ? dataUserPost.profilePic : default_profile}
              className="rounded-full size-12 "
              alt="profile-post"
            />
          </Link>

          <div className="flex flex-col gap-1 flex-grow">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {dataUserPost?.name}
            </span>
            <span className="text-xs text-slate-900 dark:text-slate-300">
              {distanceToNow(post.createdAt)}
            </span>
          </div>
          {post.postedBy === user._id ? (
            <button
              className="size-6 cursor-pointer duration-300  hover:bg-slate-700 p-[3px] rounded-full flex items-center justify-center"
              ref={moreButtonRef}
            >
              <CgMore id="more-option-post" onClick={() => handlePopupMoreOption(post._id)} />
            </button>
          ) : null}
          <PopupOptionPost
            buttonMoreRef={moreButtonRef}
            resetStatePopup={() => setPopupDeleteId(null)}
            postId={popupDeleteId === post._id ? post._id : null}
            actionDelete={handleDeletePost}
          />
        </div>

        {post.img != "" && post.text != "" ? (
          <div
            className="flex flex-col gap-3 cursor-pointer"
            onClick={() => dispatch({ type: "SET_OPEN_DETAIL_POST", postId: post._id })}
          >
            <p className="w-full p-1 text-sm ">{post.text}</p>
            <img
              src={post.img}
              className="max-h-96 h-full w-full rounded-lg object-center object-fill"
              alt="post-img"
            />
          </div>
        ) : post.img != "" ? (
          <img
            src={post.img}
            className="max-h-96 h-full w-full rounded-lg object-center object-fill cursor-pointer"
            alt="post-img"
            onClick={() => dispatch({ type: "SET_OPEN_DETAIL_POST", postId: post._id })}
          />
        ) : (
          <p className="w-full py-3 px-1">{post.text}</p>
        )}

        <div className="flex justify-between  gap-3 w-full">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <button
                className="bg-white/15 flex items-center justify-center rounded-full size-8"
                onClick={() => handleLike()}
              >
                <FcLike className="size-4" />
              </button>
              <span className="text-[13px] font-semibold">{post.likes.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-white/15 flex items-center justify-center rounded-full size-8">
                <FaCommentDots className="size-4" />
              </button>
              <span className="text-[13px] font-semibold">{post.replies.length}</span>
            </div>
          </div>
          <div className="flex gap-5">
            <button className="bg-white/15 flex items-center justify-center rounded-full size-8">
              <IoIosSend className="size-4" />
            </button>
            <button className="bg-white/15 flex items-center justify-center rounded-full size-8">
              <MdOutlineIosShare className="size-4" />
            </button>
          </div>
        </div>

        <div
          className={`flex flex-col w-full gap-3  border-t border-b border-white/5 py-3 ${
            !post.replies.length && "hidden"
          }`}
        >
          {post.replies.map((reply, index) => (
            <div className="flex gap-2.5 " key={index}>
              <img
                src={reply.userProfilePic ? reply.userProfilePic : default_profile}
                className="size-8 rounded-full"
                alt="comment-profile"
              />
              <div className="flex flex-col bg-slate-700/80 py-1 px-3 rounded-lg">
                <span className="text-sm font-semibold">{reply.name}</span>
                <p className="text-sm font-medium tracking-wide">{reply.text}</p>
              </div>
            </div>
          ))}
          {post.replies.length > 3 ? (
            <div className="flex items-center gap-2 text-white/45 hover:underline cursor-pointer">
              <FaAngleDown /> <span className="text-sm ">More Comment</span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 w-full  duration-300 transition-all">
          <img
            src={user.profilePic ? user.profilePic : default_profile}
            alt="current-profile"
            className="size-8 rounded-full"
          />
          <textarea
            className="grow text-white  font-medium py-2 px-3  w-full rounded-lg bg-slate-700/80 text-sm outline-none resize-none overflow-hidden "
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
            disabled={replyMsg === ""}
            className={`py-2.5 px-3 rounded-full text-xs font-semibold bg-white/15 ${
              replyMsg === "" ? "hidden" : "block"
            }  `}
            onClick={() => handleReplyPost()}
          >
            Replay
          </button>
        </div>
      </div>
    </>
  );
};

export default Post;
