import * as z from "zod";

export const registerSchema = z
  .object({
    username: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Your passwords do not match",
    path: ["confirmPassword"],
  });
