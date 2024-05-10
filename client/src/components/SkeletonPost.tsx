const SkeletonPost = ({ postFeed }: { postFeed: boolean }) => {
  return (
    <div
      className={`rounded-xl p-5 flex flex-col  items-center gap-3 w-full ${
        postFeed ? "max-w-xl" : ""
      } bg-blue-3 shadow-lg`}
    >
      <div className="flex items-center gap-3 w-full">
        <span className="size-12 rounded-full bg-slate-700 animate-pulse"></span>
        <div className="flex flex-col gap-1 flex-grow">
          <span className="h-3 w-16 rounded-xl bg-slate-700 animate-pulse"></span>
          <span className="h-3 w-20 rounded-xl bg-slate-700 animate-pulse"></span>
        </div>
        <span className="size-5 rounded-full bg-slate-700 animate-pulse"></span>
      </div>
      <span className="h-56 w-full bg-slate-700 rounded-lg object-center object-fill"></span>
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-2">
          <span className="h-3 w-12 rounded-xl bg-slate-700 animate-pulse"></span>
          <span className="h-3 w-12 rounded-xl bg-slate-700 animate-pulse"></span>
        </div>
        <div className="flex gap-3">
          <span className="size-5 rounded-full bg-slate-700 animate-pulse"></span>
          <span className="size-5 rounded-full bg-slate-700 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPost;
