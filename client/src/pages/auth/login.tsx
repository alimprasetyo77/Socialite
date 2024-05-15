import { Link, useNavigate } from "react-router-dom";
import LoginRegister from "../../components/LoginRegister";
import { login } from "../../utils/apis/auth/api";
import { ILoginType, loginSchema } from "../../utils/apis/auth/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/contexts/auth";

const Login = () => {
  const { changeToken } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginType>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (body: ILoginType) => {
    try {
      const result = await login(body);
      toast.success(`${result.message}`);
      changeToken(result.data.token);
      navigate("/");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <LoginRegister>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col items-start gap-6  h-full justify-center p-14"
      >
        <div className="space-y-2 py-4">
          <h1 className="text-2xl font-semibold text-white">Sign in to your account</h1>
          <h5 className="text-sm text-gray-300 tracking-wide">
            If you haven’t signed up yet.{" "}
            <Link to={"/register"} className="text-blue-500">
              Register here!
            </Link>
          </h5>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="email" className="text-white text-sm font-semibold">
            Email address
          </label>
          <input
            type="email"
            placeholder="Email"
            className={`py-2.5 px-3.5 placeholder:text-white/80 font-medium rounded-md shadow-md border-none outline-none text-sm bg-white/10 text-white ${
              errors.email && " ring-2 ring-red-500"
            }`}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm font-medium text-red-500">{errors.email.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="password" className="text-white text-sm font-semibold">
            Password
          </label>
          <input
            type="password"
            placeholder="******"
            className={`py-2.5 px-3.5 placeholder:text-white/80 font-medium rounded-md shadow-md border-none outline-none text-sm bg-white/10 text-white ${
              errors.password && " ring-2 ring-red-500"
            }`}
            disabled={isSubmitting}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm font-medium text-red-500">{errors.password.message}</p>
          ) : null}
        </div>
        <span className="text-blue-500 text-sm  ml-auto">Forgot password</span>
        <button
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className="bg-blue-secondary w-full py-1.5 px-2 rounded text-white text-sm font-medium disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Loading.." : "Sign In"}
        </button>
        {/* <div className="flex items-center gap-2 w-full py-5">
          <span className="border h-px border-white/10 w-full"></span>
          <span className="text-sm text-white whitespace-nowrap font-medium">Or continue with</span>
          <span className="border h-px border-white/10 w-full"></span>
        </div> */}
        {/* <div className="flex items-center gap-x-3 w-full ">
          <button className="p-2 rounded-md font-semibold text-sm text-white bg-blue-secondary w-full">
            Facebook
          </button>
          <button className="p-2 rounded-md font-semibold text-sm text-white bg-blue-secondary w-full">
            Twitter
          </button>
          <button className="p-2 rounded-md font-semibold text-sm text-white bg-blue-secondary w-full">
            Github
          </button>
        </div> */}
      </form>
    </LoginRegister>
  );
};

export default Login;
