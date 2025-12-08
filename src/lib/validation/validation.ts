import { z } from "zod";
import { Role } from "@/generated/prisma/enums";

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
  logo: z.string().url("Logo must be a valid URL").optional(),
});

export const setPendingCompanySchema = z.object({
  companyId: z.uuid(),
  role: z.enum(Role),
  email: z.email().optional(),
});

export const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type CompanySignupSchema = z.infer<typeof companySignupSchema>;
export type SetPendingCompanySchema = z.infer<typeof setPendingCompanySchema>;
export type EmailSchema = z.infer<typeof emailSchema>;
