import { BiX } from "react-icons/bi";
import { memo, useEffect, useRef, useState } from "react";
import { IoImage } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { IPostType, PostSchema } from "../../utils/apis/post/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaX } from "react-icons/fa6";
import { post } from "../../utils/apis/post/api";
import toast from "react-hot-toast";
import { IUser } from "../../utils/apis/user/types";
import { PopupAction } from "../../utils/reducers/types";
interface PopupCreatePostProps {
  isOpenCreatePost: boolean;
  user: Partial<IUser>;
  dispatch: React.Dispatch<PopupAction>;
}
const PopupCreatePost = memo<PopupCreatePostProps>(({ dispatch, isOpenCreatePost, user }) => {
  console.log("RENDER POPUP CREATE POST");

  const popupRef = useRef<any>();
  const [imagePreview, setImagePreview] = useState("");

  const handleClose = (e: any) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      dispatch({ type: "SET_CLOSE_POST" });
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);
  const {
    register,
    handleSubmit,
    resetField,
    reset,

    formState: { isSubmitting, errors, isDirty },
  } = useForm<IPostType>({
    resolver: zodResolver(PostSchema),
  });

  const handlePost = async (body: IPostType) => {
    try {
      const result = await post(body, user._id!);
      toast.success(result.message);
      dispatch({ type: "SET_CLOSE_POST" });
      reset();
      setImagePreview("");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  if (!isOpenCreatePost) return;

  return (
    <div className="fixed inset-0 bg-white/5 z-[60] backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handleSubmit(handlePost)}
        className="max-w-xl w-full mx-auto bg-white dark:bg-blue-3  text-white rounded-xl shadow-sm flex flex-col gap-4"
        ref={popupRef}
      >
        <div className="flex items-center p-3 border-b border-black/30 dark:border-white/30">
          <span className="w-full text-center text-sm font-semibold tracking-wide dark:text-white text-slate-900">
            Create Status
          </span>
          <button onClick={() => dispatch({ type: "SET_CLOSE_POST" })}>
            <BiX className="size-8" />
          </button>
        </div>
        <textarea
          cols={30}
          rows={8}
          className="py-3 px-6 bg-transparent outline-none placeholder:text-black/90 dark:placeholder:text-white/90 text-slate-900 dark:text-white text-lg"
          placeholder="What do you have in mind ?"
          {...register("text")}
        ></textarea>
        {imagePreview ? (
          <div className="size-28 m-4 rounded-lg relative group ">
            <img src={imagePreview} alt="image-preview" className="w-full h-full rounded-sm " />
            <FaX
              className="text-red-500 absolute -top-1 -right-1 size-4 p-[3px] bg-white/80 rounded-full group-hover:opacity-100 opacity-0 duration-300 cursor-pointer"
              onClick={() => {
                resetField("img");
                setImagePreview("");
              }}
            />
          </div>
        ) : null}
        {errors.text ? <p className="text-sm px-4 text-red-500">{errors.text.message}</p> : null}
        {errors.img ? (
          <p className="text-sm px-4 text-red-500">{errors.img.message?.toString()}</p>
        ) : null}
        <div className="flex p-4">
          <input
            type="file"
            hidden
            id="image-upload"
            {...register("img", {
              onChange: (e) => {
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              },
            })}
          />
          <label
            htmlFor="image-upload"
            className="flex gap-3 items-center justify-center bg-sky-500/50 dark:bg-sky-500/15 border dark:border-gray-500/70 w-28 rounded-md py-1 text-sm"
          >
            <IoImage />
            <span>Image</span>
          </label>

          <button
            disabled={isSubmitting || !isDirty}
            className="px-4 py-2 w-32 rounded-md bg-sky-500 dark:bg-sky-600 text-white text-sm font-semibold ml-auto tracking-wide disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Loading.." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
});

export default PopupCreatePost;
