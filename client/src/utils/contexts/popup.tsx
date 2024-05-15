import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";
import { PopupAction, PopupState } from "../reducers/types";
import { popupReducer } from "../reducers/popupReducer";

interface Context {
  state: PopupState;
  dispatch: Dispatch<PopupAction>;
}

const PopupContext = createContext<Context>({
  state: {
    isOpenProfile: false,
    isOpenMessage: false,
    isOpenNotification: false,
    isOpenSearch: false,
    isOpenPost: false,
    isOpenPostStory: false,
    isOpenOptionPost: false,
    IsOpenChat: false,
    isOpenBio: {
      user: null,
      isOpen: false,
    },
    isOpenDetailPost: {
      postId: "",
    },
    isOpenPostStatus: false,
    isOpenSidebar: false,
    isOpenDetailStatusPost: {
      isOpen: false,
      postsStatus: null,
    },
  },
  dispatch: () => null,
});

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(popupReducer, {
    isOpenProfile: false,
    isOpenMessage: false,
    isOpenNotification: false,
    isOpenSearch: false,
    isOpenPost: false,
    isOpenPostStory: false,
    isOpenOptionPost: false,
    IsOpenChat: false,
    isOpenBio: {
      user: null,
      isOpen: false,
    },
    isOpenDetailPost: {
      postId: "",
    },
    isOpenPostStatus: false,
    isOpenSidebar: false,
    isOpenDetailStatusPost: {
      isOpen: false,
      postsStatus: null,
    },
  });
  const popupContextValue = {
    state,
    dispatch,
  };
  return <PopupContext.Provider value={popupContextValue}>{children}</PopupContext.Provider>;
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  return context;
};
