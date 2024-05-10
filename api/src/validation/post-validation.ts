import { z, ZodType } from "zod";
const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;

export const POST: ZodType = z.object({
  postedBy: z.string().min(1, { message: "Id sender required" }),
  text: z.string().optional(),
  img: z
    .string()
    .optional()
    .refine(
      (data) => {
        if (!data) return true;
        const base64Part = data?.split(",")[1] || data;
        return base64Regex.test(base64Part as string);
      },
      { message: "Invalid format base64" }
    ),
});
export const POST_STATUS: ZodType = z.object({
  postedBy: z.string().min(1, { message: "Id sender required" }),
  caption: z.string().optional(),
  image: z.string().refine(
    (data) => {
      if (!data) return true;
      const base64Part = data?.split(",")[1] || data;
      return base64Regex.test(base64Part as string);
    },
    { message: "Invalid format base64" }
  ),
});

export const REPLY_POST = z.object({
  text: z.string().min(1, { message: "Text field is required" }),
});
