import * as z from "zod";

export const createPostSchema = z.object({
  message: z.string().max(1000),
});
