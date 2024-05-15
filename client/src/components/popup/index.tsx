import { useAuth } from "../../utils/contexts/auth";
import { usePopup } from "../../utils/contexts/popup";
import Bio from "./Bio";
import Chat from "./Chat";
import Chats from "./Chats";
import PopupCreatePost from "./CreatePost";
import CreatePostStatus from "./CreatePostStatus";
import DetailPost from "./DetailPost";
import DetailPostStatus from "./DetailPostStatus";
import Notifications from "./Notifications";
import PopupProfile from "./Profile";

const Popup = () => {
  const { state, dispatch } = usePopup();
  const { user, changeToken } = useAuth();

  return (
    <>
      {state.isOpenDetailStatusPost && (
        <DetailPostStatus
          dispatch={dispatch}
          isOpenDetailPostStatus={state.isOpenDetailStatusPost}
        />
      )}

      {state.isOpenPostStatus && (
        <CreatePostStatus dispatch={dispatch} isOpenCreatePostStatus={state.isOpenPostStatus} />
      )}
      {state.isOpenBio && (
        <Bio dispatch={dispatch} isOpen={state.isOpenBio.isOpen} user={state.isOpenBio.user!} />
      )}
      {state.isOpenDetailPost.postId && (
        <DetailPost dispatch={dispatch} postId={state.isOpenDetailPost.postId} />
      )}

      {state.IsOpenChat && <Chat dispatch={dispatch} isOpenChat={state.IsOpenChat} />}
      {state.isOpenMessage && <Chats dispatch={dispatch} isOpenChat={state.isOpenMessage} />}
      {state.isOpenProfile && (
        <PopupProfile
          isOpenProfile={state.isOpenProfile}
          changeToken={changeToken}
          dispatch={dispatch}
          user={user}
        />
      )}
      {state.isOpenNotification && (
        <Notifications dispatch={dispatch} isOpenNotification={state.isOpenNotification} />
      )}
      {state.isOpenPost && (
        <PopupCreatePost dispatch={dispatch} isOpenCreatePost={state.isOpenPost} user={user} />
      )}
    </>
  );
};

export default Popup;
