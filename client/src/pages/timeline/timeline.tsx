import { BiEditAlt, BiLocationPlus } from "react-icons/bi";
import Post from "../../components/Post";
import toast from "react-hot-toast";
import { getMyPosts } from "../../utils/apis/post/api";
import { useEffect, useState } from "react";
import { IFeedType } from "../../utils/apis/feed/types";
import { FaGraduationCap } from "react-icons/fa";
import { CgWorkAlt } from "react-icons/cg";
import { HiMiniSignal } from "react-icons/hi2";
import { usePopup } from "../../utils/contexts/popup";
import { useNavigate, useParams } from "react-router-dom";
import { followUnFollowUser, getUser, uploadCoverPic } from "../../utils/apis/user/api";
import { IUser } from "../../utils/apis/user/types";
import { useAuth } from "../../utils/contexts/auth";
import SkeletonPost from "../../components/SkeletonPost";
import { useConversations } from "../../utils/contexts/conversations";
import defaultProfile from "../../../public/default-profile.jpeg";
import Loading from "../../components/Loading";

const Timeline = () => {
  const { dispatch } = usePopup();
  const { user, fetchCurrentUser } = useAuth();
  const [myPosts, setMyPosts] = useState<IFeedType[]>();
  const [targetUser, setTargetUser] = useState<IUser>();
  const { id } = useParams();
  const [loadingPost, setLoadingPost] = useState(false);
  const { conversations, setConversations } = useConversations();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyPosts();
    if (id) {
      fetchUser();
    }
  }, [id]);
  const fetchUser = async () => {
    try {
      const result = await getUser(id);
      setTargetUser(result.data);
    } catch (error: any) {
      toast.error(error.toString());
    }
  };
  const fetchMyPosts = async () => {
    try {
      setLoadingPost(true);
      const result = await getMyPosts(id as string);
      setMyPosts(result.data);
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setLoadingPost(false);
    }
  };

  const onSendMessage = () => {
    const existConversations =
      conversations && conversations.find((value) => value?.participants[0]?._id === id);
    if (existConversations) {
      navigate(`/messages?conversation=${existConversations._id}`);
      return;
    }
    const mockConversation = {
      mock: true,
      lastMessage: {
        text: "",
        sender: "",
      },
      _id: Date.now(),
      participants: [
        {
          _id: id,
          username: targetUser?.username,
          profilePic: targetUser?.profilePic,
        },
      ],
    };
    setConversations((prev: any) => [...prev, mockConversation]);
    dispatch({ type: "SET_OPEN_CHAT" });
  };
  const handleUploadCoverPic = async (e: any) => {
    try {
      setLoading(true);
      const result = await uploadCoverPic(e.target.files[0]);
      fetchCurrentUser();
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUnfollow = async () => {
    try {
      const result = await followUnFollowUser(targetUser?._id as string);
      toast.success(result.message);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="max-w-[1065px] w-full mx-auto space-y-10">
        <div className="bg-blue-3 shadow rounded-b-2xl w-full ">
          <div className="h-72 relative ">
            <img
              src={
                targetUser?.coverPic
                  ? targetUser?.coverPic
                  : user.coverPic
                  ? user.coverPic
                  : "https://source.unsplash.com/900x200?nature"
              }
              className="w-full h-full object-cover "
              alt="photo-sampul"
            />
            {user._id === id ? (
              <>
                <input type="file" hidden id="cover-picture" onChange={handleUploadCoverPic} />
                <label
                  htmlFor="cover-picture"
                  className="absolute bottom-5 right-5 shadow-sm bg-black/40 p-2 rounded-full text-xs cursor-pointer z-20 "
                >
                  <BiEditAlt className="size-5" />
                </label>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-4 flex-col relative -mt-[170px] z-10 pb-10">
            <img
              src={targetUser?.profilePic ? targetUser?.profilePic : defaultProfile}
              alt="profile-image"
              className="size-[160px] md:size-[180px] rounded-full border-2 border-white/50"
            />
            <h3 className="text-3xl font-bold">{targetUser?.name}</h3>
            <div className="flex items-center gap-3 text-sm">
              {user._id !== id ? (
                <>
                  <button
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/15 cursor-pointer"
                    onClick={() => onSendMessage()}
                  >
                    Send message
                  </button>
                  {!user.following?.includes(targetUser?._id!) ? (
                    <span
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-sky-500 cursor-pointer"
                      onClick={handleFollowUnfollow}
                    >
                      Follow
                    </span>
                  ) : (
                    <span
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/15 cursor-pointer"
                      onClick={handleFollowUnfollow}
                    >
                      Unfollow
                    </span>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col-reverse items-center lg:items-start gap-10">
          <div className="flex-1 flex flex-col items-center gap-4 px-4 md:px-10 lg:px-0">
            {user._id === id ? (
              <div className="rounded-xl w-full p-5 bg-blue-3 shadow-lg">
                <button
                  className="bg-slate-700 rounded-lg p-3 text-white text-sm font-semibold w-full"
                  onClick={() => dispatch({ type: "SET_OPEN_POST" })}
                >
                  What do you have in mind?
                </button>
              </div>
            ) : null}
            {myPosts ? (
              myPosts.map((post) => (
                <Post post={post} refetchFeed={fetchMyPosts} postFeed={false} key={post._id} />
              ))
            ) : (
              <div className="w-full bg-blue-3 p-5 rounded-xl text-center ">No posts</div>
            )}
            {loadingPost && <SkeletonPost postFeed={false} />}
          </div>
          <div className="max-w-[800px] w-full px-4 md:px-10 lg:px-0 lg:w-[400px] space-y-10">
            <div className="space-y-4 bg-blue-3 shadow rounded-2xl p-5">
              <div className="flex justify-between ">
                <h4 className="font-semibold">Intro</h4>
                {targetUser?.bio.live &&
                targetUser?.bio.studi &&
                targetUser?.bio.work &&
                targetUser._id === user._id ? (
                  <button
                    className="text-sm text-blue-500"
                    onClick={() => dispatch({ type: "SET_OPEN_BIO", user: targetUser })}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => dispatch({ type: "SET_OPEN_BIO" })}
                    hidden={targetUser?._id !== user._id}
                    className="text-sm hover:underline cursor-pointer "
                  >
                    Add Intro
                  </button>
                )}
              </div>
              {targetUser?.bio.live || targetUser?.bio.studi || targetUser?.bio.work ? (
                <>
                  <div className="flex items-center gap-3 ">
                    <BiLocationPlus />
                    <p className="text-slate-300 text-sm">
                      Live In
                      <span className="ml-2  text-white font-semibold">{targetUser?.bio.live}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ">
                    <FaGraduationCap />
                    <p className="text-slate-300 text-sm">
                      Studied at
                      <span className="ml-2  text-white font-semibold">
                        {targetUser?.bio.studi}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ">
                    <CgWorkAlt />
                    <p className="text-slate-300 text-sm">
                      Work at
                      <span className="ml-2  text-white font-semibold">{targetUser?.bio.work}</span>
                    </p>
                  </div>
                </>
              ) : null}
              <div className="flex items-center gap-3 ">
                <HiMiniSignal />
                <p className="text-slate-300 text-sm">
                  Followed By
                  <span className="ml-2  text-white font-semibold">
                    {targetUser?.followers.length} People
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Timeline;
