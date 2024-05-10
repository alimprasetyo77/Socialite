import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Feed from "../pages/feed/feed";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Layout from "../components/Layout";
import Setting from "../pages/user/setting";
import Timeline from "../pages/timeline/timeline";
import ProtectedRoute from "./protected-route";
import Messages from "../pages/messages/messages";
import Video from "../pages/video/video";

export const router = () => {
  const router = createBrowserRouter([
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: [
            {
              index: true,
              element: <Feed />,
              errorElement: (
                <div className="text-center w-full mt-28 text-2xl font-semibold tracking-wider">
                  Error
                </div>
              ),
            },
            {
              path: "/messages",
              element: <Messages />,
            },
            {
              path: "/video",
              element: <Video />,
            },
            {
              path: "/setting",
              element: <Setting />,
            },
            {
              path: "/timeline/:id",
              element: <Timeline />,
            },
          ],
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default router;
