import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../utils/contexts/auth";

const ProtectedRoute = () => {
  const { pathname } = useLocation();
  const { token } = useAuth();

  const authProtected = ["/login", "/register"];
  const tokenProtected = ["/", "/messages", "/setting"];
  if (authProtected.includes(pathname) && token) {
    return <Navigate to={"/"} />;
  }

  if (tokenProtected.includes(pathname) || pathname.includes("timeline")) {
    if (!token) return <Navigate to={"/login"} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
