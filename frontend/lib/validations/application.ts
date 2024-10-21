import * as z from "zod";

const dateSchema = z.object({
  date: z.string(),
  type: z.enum(["AM", "PM"]),
});

export const applicationSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  remarks: z.string(),
  file:
    typeof window !== "undefined" && typeof FileList !== "undefined"
      ? z
          .instanceof(FileList)
          .optional()
          .or(z.array(z.instanceof(File)).optional())
      : z.array(z.instanceof(File)).optional(),

  date_type: z.array(dateSchema).nonempty(),
});
