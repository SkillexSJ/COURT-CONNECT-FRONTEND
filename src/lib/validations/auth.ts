import * as z from "zod";

export const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    role: z.enum(["USER", "ORGANIZER"]),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    businessName: z
      .string()
      .max(100, "Business name must be less than 100 characters")
      .optional(),
    phoneNumber: z
      .string()
      .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im, {
        message: "Invalid phone number format",
      })
      .optional()
      .or(z.literal("")),
  })
  .superRefine((value, ctx) => {
    if (value.role === "ORGANIZER") {
      if (!value.businessName || value.businessName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessName"],
          message: "Business name is required for organizer",
        });
      }
    }
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// For organizer additional details
export const organizerDetailsSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  phoneNumber: z
    .string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im, {
      message: "Invalid phone number format",
    })
    .optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  address: z
    .string()
    .max(255, "Address must be less than 255 characters")
    .optional(),
});
