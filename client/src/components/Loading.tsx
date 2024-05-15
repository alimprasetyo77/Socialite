import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="fixed inset-0 dark:text-white text-slate-900 bg-black/60 z-[100] text-2xl flex items-center justify-center">
      <div className="space-y-3 flex flex-col items-center">
        <AiOutlineLoading3Quarters className="size-16 animate-spin " />
        <span className="text-sm font-bold">Please wait</span>
      </div>
    </div>
  );
};

export default Loading;
