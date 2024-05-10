import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IUserSecurityUpdateType } from "../utils/apis/user/types";

interface SecuritySettingProps {
  register: UseFormRegister<IUserSecurityUpdateType>;
  errors: FieldErrors;
}
const SecuritySetting = ({ register, errors }: SecuritySettingProps) => {
  return (
    <div className="mx-auto max-w-2xl ">
      <div className="space-y-8">
        {/* Password */}
        <div className="flex items-center gap-x-5 sm:gap-x-10">
          <label
            htmlFor="currentPassword"
            className="w-44 text-start text-sm sm:text-base dark:text-white text-slate-900"
          >
            Current Password
          </label>
          <input
            className="py-1.5 px-3 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-black/80 dark:placeholder:text-white/80  text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-700 outline-none"
            id="currentPassword"
            type="password"
            placeholder="Current Password"
            {...register("currentPassword")}
          />
        </div>
        {errors.currentPassword ? (
          <p className="text-sm font-medium text-red-500  whitespace-nowrap !mt-2.5 ml-40">
            {errors.currentPassword.message?.toString()}
          </p>
        ) : null}
        {/* confirmPassword */}
        <div className="flex items-center gap-x-5 sm:gap-x-10">
          <label
            htmlFor="newPassword"
            className="w-44 text-start text-sm sm:text-base dark:text-white text-slate-900"
          >
            New Password
          </label>
          <input
            className="py-1.5 px-3 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-black/80 dark:placeholder:text-white/80 text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-700 outline-none"
            id="newPassword"
            type="password"
            placeholder="New Password"
            {...register("newPassword")}
          />
        </div>
        {errors.newPassword ? (
          <p className="text-sm font-medium text-red-500  whitespace-nowrap !mt-2.5 ml-40">
            {errors.newPassword.message?.toString()}
          </p>
        ) : null}
        <div className="flex items-center gap-x-5 sm:gap-x-10">
          <label
            htmlFor="repeatPassword"
            className="w-44 text-start text-sm sm:text-base dark:text-white text-slate-900"
          >
            Repeat Password
          </label>
          <input
            className="py-1.5 px-3 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-black/80 dark:placeholder:text-white/80 text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-700 outline-none"
            id="repeatPassword"
            type="password"
            placeholder="Repeat Password"
            {...register("repeatPassword")}
          />
        </div>
        {errors.repeatPassword ? (
          <p className="text-sm font-medium text-red-500  whitespace-nowrap !mt-2.5 ml-40">
            {errors.repeatPassword.message?.toString()}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default SecuritySetting;
