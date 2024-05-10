import { ReactNode } from "react";
import { Link } from "react-router-dom";

const LoginRegister = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex">
      <div className="w-[580px] min-h-screen bg-blue-primary p-10">
        <Link to={"/"}>
          <img
            src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo-light.png"
            alt="brand-icon"
            className="w-28"
          />
        </Link>
        {children}
      </div>
      <div
        className="flex-grow min-h-screen bg-gray-300 bg-no-repeat bg-cover relative"
        style={{
          backgroundImage:
            "url('https://demo.foxthemes.net/socialite-v3.0/assets/images/post/img-3.jpg')",
        }}
      >
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
          <img
            src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo-icon.png"
            alt="logo"
            className="w-12"
          />
          <h3 className="text-2xl font-semibold text-white py-7">Connect With Friends</h3>
          <p className="text-white text-lg leading-8">
            This phrase is more casual and playful. It suggests that you are keeping your friends
            updated on what’s happening in your life.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
