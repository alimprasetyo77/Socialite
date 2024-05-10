import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/contexts/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IUserSecurityUpdateType,
  IUserUpdateType,
  userSecurityUpdateSchema,
  userUpdateSchema,
} from "../../utils/apis/user/types";
import { BiCamera, BiLoader } from "react-icons/bi";
import toast from "react-hot-toast";
import { updatePassword, updatePhotoProfile, updateUser } from "../../utils/apis/user/api";
import { useEffect, useState } from "react";
import SecuritySetting from "../../components/SecuritySetting";
import default_profile from "../../../public/default-profile.jpeg";
const Setting = () => {
  const { user, fetchCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [Tabs, setTabs] = useState({
    general: true,
    security: false,
  });

  useEffect(() => {
    setValue("name", user.name!);
    setValue("username", user.username!);
    setValue("email", user.email!);
  }, [user]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IUserUpdateType>({
    resolver: zodResolver(userUpdateSchema),
  });
  const handleUpdateUser = async (body: IUserUpdateType) => {
    try {
      const result = await updateUser(body);
      toast.success(result.message);
      fetchCurrentUser();
    } catch (error: any) {
      toast(error.toString());
    }
  };

  const {
    register: securityRegister,
    handleSubmit: securityHandleSubmit,
    reset: securityReset,
    formState: { errors: securityErrors, isSubmitting: securitySubmitting },
  } = useForm<IUserSecurityUpdateType>({
    resolver: zodResolver(userSecurityUpdateSchema),
  });

  const handleUpdatePassword = async (body: IUserSecurityUpdateType) => {
    try {
      const result = await updatePassword(body);
      toast(result.message);
      navigate("/");
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  const handlePhotoProfile = async (photo: any) => {
    try {
      const result = await updatePhotoProfile(photo);
      toast.success(result.message);
      fetchCurrentUser();
    } catch (error: any) {
      toast.error(error.toString());
    }
  };
  return (
    <div className="container py-16 px-4 md:px-0 mx-auto ">
      <form
        onSubmit={
          Tabs.general ? handleSubmit(handleUpdateUser) : securityHandleSubmit(handleUpdatePassword)
        }
        className=" border-900 mx-auto flex max-w-4xl flex-col rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-blue-3 shadow-lg gap-3"
      >
        <div className=" flex items-center justify-between px-10 sm:px-24 py-8 gap-10">
          <div className="flex items-center flex-col sm:flex-row gap-x-8 gap-y-4">
            <div className="relative ">
              <label htmlFor="file-input" className="cursor-pointer">
                <img
                  src={user.profilePic ? user.profilePic : default_profile}
                  className="h-24 w-24 min-w-24 rounded-full object-cover "
                  alt="profile"
                />
                <BiCamera className="absolute bottom-0 right-0  rounded-full bg-slate-700 " />
              </label>

              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={(e: any) => {
                  handlePhotoProfile(e.target.files[0]);
                }}
              />
            </div>

            <div className="flex flex-col ">
              <h3 className="text-2xl font-semibold dark:text-white text-slate-900">
                {user.name}{" "}
              </h3>
              <span className="text-sm text-sky-500 underline">@{user.username}</span>
            </div>
          </div>
          <button
            className=" rounded-full bg-rose-600 px-4 py-1 font-inter text-sm whitespace-nowrap"
            type="button"
          >
            delete account
          </button>
        </div>
        <div className="gap-6 w-full px-28 border-b border-black/20 dark:border-white/50 pb-5 flex items-center">
          <span
            className={`font-semibold text-sm cursor-pointer hover:underline underline-offset-8 hover:text-white duration-300 ${
              Tabs.general
                ? "underline underline-offset-8 text-slate-900 dark:text-white"
                : "text-black/70 dark:text-white/70"
            }`}
            onClick={() => setTabs({ general: true, security: false })}
          >
            General
          </span>
          <span
            className={`font-semibold text-sm cursor-pointer hover:underline underline-offset-8 hover:text-white duration-300  ${
              Tabs.security
                ? "underline underline-offset-8 text-slate-900 dark:text-white"
                : "text-black/70 dark:text-white/70"
            }`}
            onClick={() => setTabs({ general: false, security: true })}
          >
            Security
          </span>
        </div>
        <div className="p-5 sm:p-10">
          <div className="mx-auto max-w-2xl space-y-12 ">
            {Tabs.general ? (
              <>
                {/* name */}
                <div className="relative flex items-center gap-x-5 sm:gap-x-10 ">
                  <label
                    htmlFor="name"
                    className="w-32 text-start text-sm sm:text-base dark:text-white text-slate-900"
                  >
                    Name
                  </label>
                  <input
                    className="py-2 px-3 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-black/80 dark:placeholder:text-white/80 text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-700"
                    id="name"
                    type="text"
                    placeholder="Monroe"
                    {...register("name")}
                  />
                </div>
                {errors.name ? (
                  <p className="text-sm font-medium text-red-500  whitespace-nowrap !mt-2.5 ml-36">
                    {errors.name.message?.toString()}
                  </p>
                ) : null}
                {/* username */}
                <div className="relative flex items-center gap-x-5 sm:gap-x-10 ">
                  <label
                    htmlFor="username"
                    className="w-32 text-start text-sm sm:text-base dark:text-white text-slate-900"
                  >
                    Username
                  </label>
                  <input
                    className="py-2 px-3 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-black/80 dark:placeholder:text-white/80 text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-700"
                    id="username"
                    type="text"
                    placeholder="username"
                    {...register("username")}
                  />
                </div>
                {errors.username ? (
                  <p className="text-sm font-medium text-red-500  whitespace-nowrap !mt-2.5 ml-36">
                    {errors.username.message?.toString()}
                  </p>
                ) : null}
                {/* Email */}
                <div className=" flex items-center gap-x-5 sm:gap-x-10 ">
                  <label
                    htmlFor="email"
                    className="w-32 text-start text-sm sm:text-base dark:text-white text-slate-900"
                  >
                    Email
                  </label>
                  <input
                    className="py-2 px-3 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-black/80 dark:placeholder:text-white/80 text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-700"
                    id="email"
                    type="email"
                    placeholder="test@mail.com"
                    {...register("email")}
                  />
                </div>
                {errors.email ? (
                  <p className="text-sm font-medium text-red-500  whitespace-nowrap !mt-2.5 ml-36">
                    {errors.email.message?.toString()}
                  </p>
                ) : null}
              </>
            ) : (
              <SecuritySetting register={securityRegister} errors={securityErrors} />
            )}
            <div className="flex items-center justify-center  gap-x-3 pt-4">
              <button
                className="rounded-lg bg-black/20 dark:bg-white/20 px-10 py-2 text-sm font-semibold shadow "
                onClick={() => {
                  if (Tabs.general) {
                    reset();
                  } else {
                    securityReset();
                  }
                }}
              >
                Cancle
              </button>
              <button
                className="rounded-lg bg-sky-500 px-10 py-2 text-sm font-semibold"
                aria-disabled={isSubmitting || securitySubmitting}
                disabled={isSubmitting || securitySubmitting}
                type="submit"
              >
                {isSubmitting || securitySubmitting ? (
                  <BiLoader className={"animate-spin text-2xl"} />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Setting;
