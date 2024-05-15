import { Dispatch, useEffect, useRef, useState } from "react";
import { PopupAction } from "../../utils/reducers/types";
import { BsX } from "react-icons/bs";
import { IPostStatus } from "../../utils/apis/post/types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BiPause, BiPlay, BiTrash, BiX } from "react-icons/bi";
import { CgMore } from "react-icons/cg";
import { distanceToNow } from "../../utils/formatter";
import toast from "react-hot-toast";
import { deletePostStatus } from "../../utils/apis/post/api";
import default_profile from "../../../public/default-profile.jpeg";
import { useAuth } from "../../utils/contexts/auth";

interface DetailPostStatusProps {
  isOpenDetailPostStatus: {
    isOpen: boolean;
    postsStatus: IPostStatus | null;
  };
  dispatch: Dispatch<PopupAction>;
}

const DetailPostStatus = ({ isOpenDetailPostStatus, dispatch }: DetailPostStatusProps) => {
  const { user } = useAuth();
  const popupRef = useRef<any>();
  const videoRef = useRef<any>();
  const [isPause, setIsPause] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  const handleDeletePostStatus = async () => {
    try {
      const result = await deletePostStatus({
        itemPostId: isOpenDetailPostStatus.postsStatus?.posts[currentIndex]._id!,
        postId: isOpenDetailPostStatus.postsStatus?._id!,
      });
      toast.success(result.message);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  const handleClose = (e: any) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      dispatch({ type: "SET_CLOSE_DETAIL_STATUS_POST" });
      setIsPause(false);
      setCurrentIndex(0);
      setCurrentDuration(100);
      setCount(0);
      setIsOpen(false);
    }
  };

  const handleAudio = () => {
    if (isPause) {
      videoRef.current.play();
      setIsPause(false);
    } else {
      videoRef.current.pause();
      setIsPause(true);
    }
  };

  const handleNext = () => {
    if (currentIndex !== isOpenDetailPostStatus.postsStatus?.posts.length! - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    setCount(0);
    setCurrentDuration(0);
    setIsOpen(false);
  };
  const handlePrev = () => {
    if (currentIndex !== 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    setCount(0);
    setCurrentDuration(0);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpenDetailPostStatus.postsStatus?.posts[currentIndex].type !== "image") {
      setCount(0);
      return;
    }
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
      if (count > 5000) {
        if (currentIndex !== isOpenDetailPostStatus.postsStatus?.posts.length! - 1) {
          setCurrentIndex((prev) => prev + 1);
          setCount(0);
        }

        clearInterval(intervalId);
      }
    }, 1);

    return () => {
      clearInterval(intervalId);
    };
  }, [handleNext, handlePrev]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);
  if (!isOpenDetailPostStatus.isOpen) return;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[60] group">
      <button
        className="hidden lg:flex top-5 bg-white size-7 rounded-full absolute right-5  duration-300 transition-all  items-center justify-center"
        onClick={() => dispatch({ type: "SET_CLOSE_DETAIL_STATUS_POST" })}
      >
        <BsX className="size-6" />
      </button>

      <div className="max-w-2xl w-full bg-black min-h-full relative " ref={popupRef}>
        {/* BUTTON PREV */}
        <button
          className="left-2 md:-left-14 top-1/2 absolute bg-white size-8 rounded-full flex items-center justify-center z-20"
          onClick={handlePrev}
        >
          <FaChevronLeft />
        </button>

        {/* BUTTON NEXT */}
        <button
          className="right-2 md:-right-14  top-1/2 absolute bg-white size-8 rounded-full flex items-center justify-center z-20"
          onClick={handleNext}
        >
          <FaChevronRight />
        </button>

        {/* Video */}
        <div className="absolute bg-blend-color-burn bg-black/10  inset-0 z-[9]"></div>
        {isOpenDetailPostStatus.postsStatus?.posts![currentIndex].type === "video" ? (
          <video
            ref={videoRef}
            src={isOpenDetailPostStatus.postsStatus.posts![currentIndex].fileUrl}
            className="absolute min-w-full min-h-full object-fill"
            autoPlay
            onEnded={() => {
              if (currentIndex !== isOpenDetailPostStatus.postsStatus?.posts.length! - 1) {
                setCurrentIndex((prev) => prev + 1);
              }
            }}
            onTimeUpdate={() =>
              setCurrentDuration(
                Math.ceil((videoRef.current.currentTime * 100) / videoRef.current.duration)
              )
            }
          ></video>
        ) : (
          <img
            src={isOpenDetailPostStatus.postsStatus?.posts![currentIndex].fileUrl}
            alt="Image-status"
            className="absolute min-w-full min-h-full object-contain "
          />
        )}

        {/* TOP */}
        <div className="top-0 absolute z-10 w-full bg-white/5 py-2 flex flex-col  items-start gap-4 px-4">
          <div className=" flex items-center gap-2 w-full">
            {Array.from(
              { length: isOpenDetailPostStatus.postsStatus?.posts?.length! },
              (_, index) => (
                <div className="bg-white/40 rounded-full min-h-1 grow overflow-hidden" key={index}>
                  {currentIndex === index && (
                    <div
                      className={`bg-white h-1 `}
                      style={{
                        width: `${
                          isOpenDetailPostStatus.postsStatus?.posts[currentIndex].type !== "image"
                            ? currentDuration
                            : (count / 5000) * 100
                        }%`,
                      }}
                    ></div>
                  )}
                </div>
              )
            )}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2 ">
              <img
                src={
                  isOpenDetailPostStatus.postsStatus?.postedBy.profilePic
                    ? isOpenDetailPostStatus.postsStatus?.postedBy.profilePic
                    : default_profile
                }
                className="size-10 rounded-full"
                alt="Profile"
              />
              <div className="text-white flex flex-col gap-0">
                <h3 className="text-sm font-bold">
                  {isOpenDetailPostStatus.postsStatus?.postedBy.name}
                </h3>
                <span className="text-[10px] text-white/70">
                  {distanceToNow(
                    isOpenDetailPostStatus.postsStatus?.posts![currentIndex].created_at.toString()!
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 relative">
              {isOpenDetailPostStatus.postsStatus?.posts![currentIndex].type === "video" ? (
                <>
                  {isPause ? (
                    <BiPlay className="size-7 text-white cursor-pointer" onClick={handleAudio} />
                  ) : (
                    <BiPause className="size-7 text-white cursor-pointer" onClick={handleAudio} />
                  )}
                </>
              ) : null}
              {isOpenDetailPostStatus.postsStatus?.postedBy._id === user._id ? (
                <CgMore
                  className="size-7 text-white cursor-pointer"
                  onClick={() => {
                    isOpen ? setIsOpen(false) : setIsOpen(true);
                  }}
                />
              ) : null}
              <BiX className="size-7 text-white cursor-pointer lg:hidden" />
              {isOpen ? (
                <div className="absolute -bottom-10 right-0 min-w-28 bg-white rounded-xl overflow-hidden">
                  <button
                    className="flex items-center gap-4 text-xs font-semibold w-full text-center p-2 "
                    onClick={handleDeletePostStatus}
                  >
                    <BiTrash className="text-red-500" />
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="bottom-0 absolute z-10 w-full bg-white/5 h-16 flex items-center justify-center">
          <span className="font-semibold text-white line-clamp-2">
            {isOpenDetailPostStatus.postsStatus?.posts![currentIndex].caption}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailPostStatus;
