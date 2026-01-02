import { z } from "zod";

const Role = ["ADMIN", "MANAGER", "EMPLOYEE"] as const;

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-zÆØÅæøå\s]+$/, "Name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-zÆØÅæøå\s]+$/, "Name can only contain letters and spaces"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const companySignupSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .regex(
      /^[A-Za-zÆØÅæøå0-9&().,/ -]+$/,
      "Company name can only contain letters, numbers, and basic punctuation"
    ),
  companyDomain: z
    .string()
    .min(1, "Company domain is required")
    .regex(
      /^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/,
      "Company domain must be a valid domain"
    ),
  logo: z.url("Logo must be a valid URL").optional(),
});

export const setPendingCompanySchema = z.object({
  companyId: z.uuid(),
  role: z.enum(Role),
  email: z.email().optional(),
});

export const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

export const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
});

export const createSurveySchema = z
  .object({
    title: z.string().min(1, "Survey title is required"),
    description: z.string().optional(),
    isGlobal: z.boolean(),
    teamIds: z.array(z.string()).optional(),
    startDate: z
      .string()
      .refine(
        (date) => {
          if (!date) return true; // Allow empty
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        { message: "Start date cannot be in the past" }
      )
      .optional(),
    endDate: z
      .string()
      .refine(
        (date) => {
          if (!date) return true; // Allow empty
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        { message: "End date cannot be in the past" }
      )
      .optional(),
  })
  .refine(
    (data) => {
      // If not global, must have at least one team
      if (!data.isGlobal && (!data.teamIds || data.teamIds.length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Please select at least one team or make survey global",
      path: ["teamIds"],
    }
  );

export const createQuestionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  answerType: z.enum(["SATISFACTION", "AGREEMENT", "SCALE"]),
  required: z.boolean().default(true),
});

export const updateQuestionSchema = createQuestionSchema.extend({
  questionId: z.uuid(),
});

export const reorderQuestionsSchema = z.object({
  questionOrders: z.array(
    z.object({
      questionId: z.uuid(),
      order: z.number().int().positive(),
    })
  ),
});

export const editProfileNameSchema = z.object({
  firstName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-zÆØÅæøå\s]+$/, "Name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-zÆØÅæøå\s]+$/, "Name can only contain letters and spaces"),
});

export const editProfileAvatarSchema = z.object({
  avatar: z.url("Avatar must be a valid URL").nullable(),
});

// forgot password (email) validation
export const forgotPasswordSchema = z.object({
  email: z
    .email("Invalid email address")
    .min(1, "Email is required")
    .toLowerCase()
    .trim(),
});
// reset password validation
export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must contain at least one letter, one number, and can include special characters (@$!%*#?&)"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// validate reset token
export const validateTokenSchema = z.object({
  token: z.string(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must contain at least one letter and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type CompanySignupSchema = z.infer<typeof companySignupSchema>;
export type SetPendingCompanySchema = z.infer<typeof setPendingCompanySchema>;
export type EmailSchema = z.infer<typeof emailSchema>;
export type CreateTeamSchema = z.infer<typeof createTeamSchema>;
export type CreateSurveySchema = z.infer<typeof createSurveySchema>;
export type EditProfileNameSchema = z.infer<typeof editProfileNameSchema>;
export type EditProfileAvatarSchema = z.infer<typeof editProfileAvatarSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ValidateTokenSchema = z.infer<typeof validateTokenSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
