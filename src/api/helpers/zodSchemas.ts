import { z } from "zod";

export const errLogSchema = z.object({
	errLogId: z.string(),
	projectName: z.string(),
	user: z.string(),
	errorName: z.string(),
	errorMessage: z.string(),
	method: z.string(),
	url: z.string(),
});
