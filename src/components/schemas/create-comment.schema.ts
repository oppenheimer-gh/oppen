import * as z from "zod";

export const createCommentSchema = z.object({
  message: z.string().max(500),
});
