import { PopupAction, PopupState } from "./types";

export const popupReducer = (state: PopupState, action: PopupAction): PopupState => {
  switch (action.type) {
    case "SET_OPEN_PROFILE":
      return { ...state, isOpenProfile: true };
    case "SET_CLOSE_PROFILE":
      return { ...state, isOpenProfile: false };
    case "SET_OPEN_MSG":
      return { ...state, isOpenMessage: true };
    case "SET_CLOSE_MSG":
      return { ...state, isOpenMessage: false };
    case "SET_OPEN_NOTIF":
      return { ...state, isOpenNotification: true };
    case "SET_CLOSE_NOTIF":
      return { ...state, isOpenNotification: false };
    case "SET_OPEN_SEARCH":
      return { ...state, isOpenSearch: true };
    case "SET_CLOSE_SEARCH":
      return { ...state, isOpenSearch: false };
    case "SET_OPEN_POST":
      return { ...state, isOpenPost: true };
    case "SET_CLOSE_POST":
      return { ...state, isOpenPost: false };
    case "SET_OPEN_POST_STORY":
      return { ...state, isOpenPostStory: true };
    case "SET_CLOSE_POST_STORY":
      return { ...state, isOpenPostStory: false };
    case "SET_OPEN_OPTION_POST":
      return { ...state, isOpenOptionPost: true };
    case "SET_CLOSE_OPTION_POST":
      return { ...state, isOpenOptionPost: false };
    case "SET_OPEN_CHAT":
      return { ...state, IsOpenChat: true };
    case "SET_CLOSE_CHAT":
      return { ...state, IsOpenChat: false };
    case "SET_OPEN_BIO":
      return { ...state, isOpenBio: { user: action.user!, isOpen: true } };
    case "SET_CLOSE_BIO":
      return { ...state, isOpenBio: { user: null, isOpen: false } };
    case "SET_OPEN_DETAIL_POST":
      return { ...state, isOpenDetailPost: { postId: action.postId } };
    case "SET_CLOSE_DETAIL_POST":
      return { ...state, isOpenDetailPost: { postId: "" } };
    case "SET_OPEN_POST_STATUS":
      return { ...state, isOpenPostStatus: true };
    case "SET_CLOSE_POST_STATUS":
      return { ...state, isOpenPostStatus: false };
    case "SET_OPEN_SIDEBAR":
      return { ...state, isOpenSidebar: true };
    case "SET_CLOSE_SIDEBAR":
      return { ...state, isOpenSidebar: false };
    case "SET_OPEN_DETAIL_STATUS_POST":
      return { ...state, isOpenDetailStatusPost: { isOpen: true, postsStatus: action.postStatus } };
    case "SET_CLOSE_DETAIL_STATUS_POST":
      return { ...state, isOpenDetailStatusPost: { isOpen: false, postsStatus: null } };
    default:
      return state;
  }
};
