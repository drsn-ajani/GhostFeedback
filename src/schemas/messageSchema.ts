import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, { message: "Content must of at least 10 characters" })
        .max(200, 'Content can not exceed 200 characters')
})