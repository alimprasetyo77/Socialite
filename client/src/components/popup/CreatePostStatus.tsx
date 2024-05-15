import { Dispatch, useEffect, useRef, useState } from "react";
import { PopupAction } from "../../utils/reducers/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { BiX } from "react-icons/bi";
import { FaX } from "react-icons/fa6";
import { IPostStatusType, PostStatusSchema } from "../../utils/apis/post/types";
import { getSignature, postStatus, uploadFilePostStatus } from "../../utils/apis/post/api";
import { useAuth } from "../../utils/contexts/auth";
import { FaImages } from "react-icons/fa";
import Loading from "../Loading";

interface CreatePostStatusProps {
  isOpenCreatePostStatus: boolean;
  dispatch: Dispatch<PopupAction>;
}

const CreatePostStatus = ({ isOpenCreatePostStatus, dispatch }: CreatePostStatusProps) => {
  const popupRef = useRef<any>();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);

  const handleClose = (e: any) => {
    if ((popupRef.current && !popupRef.current.contains(e.target)) || e.key === "Escape") {
      dispatch({ type: "SET_CLOSE_POST_STATUS" });
      setImagePreview("");
      setVideoPreview("");
    }
  };

  const {
    register,
    handleSubmit,
    resetField,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<IPostStatusType>({
    resolver: zodResolver(PostStatusSchema),
    mode: "onChange",
  });

  const handlePost = async (body: IPostStatusType) => {
    const isVideo = body.fileUrl[0].type === "video/mp4";
    try {
      setIsLoadingUpload(true);
      const signature = await getSignature(isVideo ? "videos" : "images");
      const upload = await uploadFilePostStatus(
        isVideo ? "video" : "image",
        body.fileUrl[0],
        signature.timestamp,
        signature.signature
      );
      setVideoPreview(upload.secure_url);
      const result = await postStatus(
        {
          type: upload.type,
          caption: body.caption,
          fileUrl: upload.secure_url,
        },
        user._id!
      );
      toast.success(result.message);
      dispatch({ type: "SET_CLOSE_POST_STATUS" });
      reset();
      setImagePreview("");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setIsLoadingUpload(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);
  console.log(errors);
  if (!isOpenCreatePostStatus) return;
  return (
    <>
      <div className="fixed inset-0 bg-white/5 z-[60] backdrop-blur-sm flex items-center justify-center">
        <form
          onSubmit={handleSubmit(handlePost)}
          className="max-w-xl w-full mx-auto bg-blue-3  text-white rounded-xl shadow-sm flex flex-col gap-4"
          ref={popupRef}
        >
          {isLoadingUpload ? <Loading /> : null}

          <div className="flex items-center p-3 border-b border-white/30">
            <span className="w-full text-center text-sm font-semibold tracking-wide">
              Create Status
            </span>
            <button onClick={() => dispatch({ type: "SET_CLOSE_POST_STATUS" })}>
              <BiX className="size-8" />
            </button>
          </div>
          <textarea
            cols={30}
            rows={2}
            className="py-3 px-6 bg-transparent outline-none placeholder:text-white/90 text-white text-lg"
            placeholder="What do you have in mind ?"
            {...register("caption")}
          ></textarea>
          {imagePreview || videoPreview ? (
            <div className="h-72 m-5 rounded-lg relative group ">
              {videoPreview ? (
                <video controls className="h-full w-full ">
                  <source src={videoPreview} type="video/mp4"></source>
                </video>
              ) : (
                <img
                  src={imagePreview}
                  alt="image-preview"
                  className="w-full h-full rounded-sm object-fill"
                />
              )}
              <FaX
                className="text-red-500 absolute -top-1 -right-1 size-4 p-[3px] bg-white/80 rounded-full group-hover:opacity-100 opacity-0 duration-300 cursor-pointer"
                onClick={() => {
                  resetField("fileUrl");
                  setImagePreview("");
                  setVideoPreview("");
                }}
              />
            </div>
          ) : (
            <div className="w-full h-52 max-h-56 p-4">
              <input
                type="file"
                hidden
                id="image-upload"
                {...register("fileUrl", {
                  onChange: (e) => {
                    if (e.target.files[0].type === "video/mp4") {
                      setVideoPreview(URL.createObjectURL(e.target.files[0]));
                    } else {
                      setImagePreview(URL.createObjectURL(e.target.files[0]));
                    }
                  },
                })}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="w-full h-full relative">
                  <FaImages className="absolute bottom-16 size-8 left-1/2 -translate-x-1/2 font-semibold text-white" />

                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm font-semibold text-white">
                    Browse to Upload Image or Video
                  </span>
                </div>
              </label>
            </div>
          )}
          {errors.caption ? (
            <p className="text-sm px-4 text-red-500">{errors.caption.message}</p>
          ) : null}
          {errors.fileUrl ? (
            <p className="text-sm px-4 text-red-500">{errors.fileUrl.message?.toString()}</p>
          ) : null}
          <div className="flex p-4">
            <button
              disabled={isSubmitting || !isDirty}
              className="px-4 py-2 w-32 rounded-md bg-sky-600 text-white text-sm font-semibold ml-auto tracking-wide disabled:bg-sky-800"
            >
              {isSubmitting ? "Loading.." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePostStatus;
