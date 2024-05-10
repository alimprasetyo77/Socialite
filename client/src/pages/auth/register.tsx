import { Link, useNavigate } from "react-router-dom";
import LoginRegister from "../../components/LoginRegister";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IRegisterType, registerSchema } from "../../utils/apis/auth/types";
import { register as registerFunc } from "../../utils/apis/auth/api";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterType>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (body: IRegisterType) => {
    try {
      const result = await registerFunc(body);
      toast.success(`${result.message}`);
      navigate("/login");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <LoginRegister>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="flex flex-col items-start gap-6  h-full justify-center p-14"
      >
        <div className="space-y-2 py-4">
          <h1 className="text-2xl font-semibold text-white">Sign up to get started</h1>
          <h5 className="text-sm text-gray-300 tracking-wide">
            If you already have an account,{" "}
            <Link to={"/login"} className="text-blue-500">
              Login here!
            </Link>
          </h5>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="name" className="text-white text-sm font-semibold">
            Name
          </label>
          <input
            type="name"
            placeholder="Name"
            className={`py-2.5 px-3.5 placeholder:text-white/80 font-medium rounded-md shadow-md border-none outline-none text-sm bg-white/10 text-white ${
              errors.name && " ring-2 ring-red-500"
            }`}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-sm font-medium text-red-500">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="username" className="text-white text-sm font-semibold">
            Username
          </label>
          <input
            type="username"
            placeholder="Username"
            className={`py-2.5 px-3.5 placeholder:text-white/80 font-medium rounded-md shadow-md border-none outline-none text-sm bg-white/10 text-white ${
              errors.username && " ring-2 ring-red-500"
            }`}
            {...register("username")}
          />
          {errors.username ? (
            <p className="text-sm font-medium text-red-500">{errors.username.message}</p>
          ) : null}
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
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm font-medium text-red-500">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="flex items-center w-full gap-3">
          <div className="flex flex-col gap-2 ">
            <label htmlFor="password" className="text-white text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              placeholder="******"
              className={`py-2.5 px-3.5 placeholder:text-white/80 font-medium rounded-md shadow-md border-none outline-none text-sm bg-white/10 text-white ${
                errors.password && " ring-2 ring-red-500"
              }`}
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm font-medium text-red-500">{errors.password.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 ">
            <label htmlFor="password" className="text-white text-sm font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="******"
              className={`py-2.5 px-3.5 placeholder:text-white/80 font-medium rounded-md shadow-md border-none outline-none text-sm bg-white/10 text-white ${
                errors.confirmPassword && " ring-2 ring-red-500"
              }`}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className="text-sm font-medium text-red-500">{errors.confirmPassword.message}</p>
            ) : null}
          </div>
        </div>
        <div className="flex gap-3">
          <input id="terms" type="checkbox" />
          <label htmlFor="terms" className="text-white text-sm ">
            you agree to our terms of use
          </label>
        </div>
        <button
          disabled={isSubmitting}
          className="bg-blue-secondary w-full py-1.5 px-2 rounded text-white text-sm font-medium disabled:bg-blue-secondary/20"
        >
          {isSubmitting ? "Loading.." : "Get Started"}
        </button>
        <div className="flex items-center gap-2 w-full py-5">
          <span className="border h-px border-white/10 w-full"></span>
          <span className="text-sm text-white whitespace-nowrap font-medium">Or continue with</span>
          <span className="border h-px border-white/10 w-full"></span>
        </div>
        <div className="flex items-center gap-x-3 w-full ">
          <button className="p-2 rounded-md font-semibold text-sm text-white bg-blue-secondary w-full">
            Facebook
          </button>
          <button className="p-2 rounded-md font-semibold text-sm text-white bg-blue-secondary w-full">
            Twitter
          </button>
          <button className="p-2 rounded-md font-semibold text-sm text-white bg-blue-secondary w-full">
            Github
          </button>
        </div>
      </form>
    </LoginRegister>
  );
};

export default Register;
