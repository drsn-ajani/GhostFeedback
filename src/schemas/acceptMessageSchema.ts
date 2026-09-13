import { z } from "zod";

export const AcceptMessageSchema = z.object({
    acceptingMessage: z.boolean()
})