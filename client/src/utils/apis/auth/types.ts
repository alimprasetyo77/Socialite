import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email("Not a valid email"),
  password: z.string().min(1, { message: "Password is required" }),
});
export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().min(1, { message: "Email is required" }).email("Not a valid email"),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, { message: "Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export type ILoginType = z.infer<typeof loginSchema>;
export type IRegisterType = z.infer<typeof registerSchema>;

export interface IResLogin {
  message: string;
  data: {
    token: string;
  };
}
