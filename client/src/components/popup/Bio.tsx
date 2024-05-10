import { useEffect, useRef } from "react";
import { PopupAction } from "../../utils/reducers/types";
import { BiX } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { addbioSchema, IUser, IUserBio } from "../../utils/apis/user/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBio } from "../../utils/apis/user/api";
import toast from "react-hot-toast";

interface PopupBioProps {
  isOpen: boolean;
  user: IUser;
  dispatch: React.Dispatch<PopupAction>;
}

const Bio = ({ isOpen, user, dispatch }: PopupBioProps) => {
  console.log("RENDER POPUP BIO");
  const bioPopup = useRef<any>();
  const { handleSubmit, register, setValue } = useForm<IUserBio>({
    resolver: zodResolver(addbioSchema),
    defaultValues: {
      live: user ? user.bio.live : "",
      studi: user ? user.bio.studi : "",
      work: user ? user.bio.work : "",
    },
  });

  const handleAddBio = async (body: IUserBio) => {
    try {
      const result = await addBio(body);
      dispatch({ type: "SET_CLOSE_BIO" });
      toast.success(result.message);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  const handleClose = (e: any) => {
    if (bioPopup.current && !bioPopup.current.contains(e.target)) {
      dispatch({ type: "SET_CLOSE_BIO" });
    }
  };
  useEffect(() => {
    setValue("live", user ? user.bio.live : "");
    setValue("studi", user ? user.bio.studi : "");
    setValue("work", user ? user.bio.work : "");
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);

    return () => {
      document.addEventListener("mousedown", handleClose);
    };
  }, []);
  if (!isOpen) return;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <form
        onSubmit={handleSubmit(handleAddBio)}
        className="max-w-md w-full rounded-xl bg-slate-700"
        ref={bioPopup}
      >
        <div className="flex p-4 text-white w-full justify-between">
          <span>Intro</span>
          <BiX
            onClick={() => dispatch({ type: "SET_CLOSE_BIO" })}
            className="size-6 cursor-pointer"
          />
        </div>
        <div className="py-4 px-8 space-y-4 border-t border-white/20 border-b">
          <div className="flex gap-3 items-center">
            <label htmlFor="live" className="max-w-10 w-full text-white text-sm">
              Live
            </label>
            <input
              type="text"
              id="live"
              {...register("live")}
              className="bg-slate-500 rounded-md py-2 px-3 w-full border-none outline-none text-white text-sm"
            />
          </div>
          <div className="flex gap-3 items-center">
            <label htmlFor="study" className="max-w-10 w-full text-white text-sm">
              Study
            </label>
            <input
              type="text"
              id="study"
              {...register("studi")}
              className="bg-slate-500 rounded-md py-2 px-3 w-full border-none outline-none text-white text-sm"
            />
          </div>
          <div className="flex gap-3 items-center">
            <label htmlFor="work" className="max-w-10 w-full text-white text-sm">
              Work
            </label>
            <input
              type="text"
              id="work"
              {...register("work")}
              className="bg-slate-500 rounded-md py-2 px-3 w-full border-none outline-none text-white text-sm"
            />
          </div>
        </div>
        <div className="flex w-full justify-end p-4">
          <button className="text-sm text-white font-semibold bg-sky-500 px-4 py-1.5 rounded-md">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Bio;
