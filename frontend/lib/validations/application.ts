import * as z from "zod";

export const applicationSchema = z.object({
    type: z.enum(["AM", "PM", "full"]),
    reason: z.string().min(1, "Reason is required"),
    file: z.instanceof(FileList).optional().or(z.undefined()),
    date: z.array(z.date()).optional().or(z.undefined())
});
