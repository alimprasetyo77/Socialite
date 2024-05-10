import Header from "./Header";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import Popup from "./popup";

const Layout = () => {
  return (
    <>
      <Popup />
      <Header />
      <div className="bg-slate-200 dark:bg-blue-primary text-white flex justify-between overflow-visible">
        <LeftSidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
