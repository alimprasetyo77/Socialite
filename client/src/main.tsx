import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./routes/route";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./utils/contexts/auth";
import { PopupProvider } from "./utils/contexts/popup";
import { SocketContextProvider } from "./utils/contexts/socket";
import { ConversationsProvider } from "./utils/contexts/conversations";
import { NotificationProvider } from "./utils/contexts/notification";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <AuthProvider>
      <SocketContextProvider>
        <PopupProvider>
          <NotificationProvider>
            <ConversationsProvider>
              <Toaster position="bottom-left" containerClassName="text-sm p-10" />
              <App />
            </ConversationsProvider>
          </NotificationProvider>
        </PopupProvider>
      </SocketContextProvider>
    </AuthProvider>
  </>
);
