import { IUser } from "../apis/user/types";

export type PopupState = {
  isOpenProfile: boolean;
  isOpenMessage: boolean;
  isOpenNotification: boolean;
  isOpenSearch: boolean;
  isOpenPost: boolean;
  isOpenPostStory: boolean;
  isOpenOptionPost: boolean;
  IsOpenChat: boolean;
  isOpenBio: {
    isOpen: boolean;
    user: IUser | null;
  };
  isOpenDetailPost: {
    postId: string;
  };
  isOpenPostStatus: boolean;
  isOpenSidebar: boolean;
};
export type PopupAction =
  | { type: "SET_OPEN_PROFILE" }
  | { type: "SET_CLOSE_PROFILE" }
  | { type: "SET_OPEN_MSG" }
  | { type: "SET_CLOSE_MSG" }
  | { type: "SET_OPEN_NOTIF" }
  | { type: "SET_CLOSE_NOTIF" }
  | { type: "SET_OPEN_SEARCH" }
  | { type: "SET_CLOSE_SEARCH" }
  | { type: "SET_OPEN_POST" }
  | { type: "SET_CLOSE_POST" }
  | { type: "SET_OPEN_POST_STORY" }
  | { type: "SET_CLOSE_POST_STORY" }
  | { type: "SET_OPEN_OPTION_POST" }
  | { type: "SET_CLOSE_OPTION_POST" }
  | { type: "SET_OPEN_CHAT" }
  | { type: "SET_CLOSE_CHAT" }
  | { type: "SET_OPEN_BIO"; user?: IUser }
  | { type: "SET_CLOSE_BIO" }
  | { type: "SET_OPEN_DETAIL_POST"; postId: string }
  | { type: "SET_CLOSE_DETAIL_POST" }
  | { type: "SET_OPEN_POST_STATUS" }
  | { type: "SET_CLOSE_POST_STATUS" }
  | { type: "SET_OPEN_SIDEBAR" }
  | { type: "SET_CLOSE_SIDEBAR" };
