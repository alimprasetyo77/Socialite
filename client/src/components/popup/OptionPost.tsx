import { useEffect, useRef } from "react";
import { BiTrash } from "react-icons/bi";
interface PopupOptionPostProps {
  postId: string | null;
  resetStatePopup: () => void;
  actionDelete: (id: string) => void;
  buttonMoreRef: any;
}
const PopupOptionPost = ({
  postId,
  resetStatePopup,
  actionDelete,
  buttonMoreRef,
}: PopupOptionPostProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClose = (e: any) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target) &&
      !buttonMoreRef.current.contains(e.target)
    ) {
      console.log("TUTUP POPUP");
      resetStatePopup();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  if (!postId) return null;
  console.log("RENDER POPUP OPTION POST");

  return (
    <div
      ref={popupRef}
      className="absolute bg-slate-700 -right-2 top-10 z-[20] py-1 px-3 rounded-lg "
    >
      <button
        className="flex items-center gap-1 hover:opacity-80"
        onClick={() => actionDelete(postId)}
      >
        <BiTrash className="text-red-500" />
        <span className="px-3 py-1 text-sm">Delete Post</span>
      </button>
    </div>
  );
};

export default PopupOptionPost;
