import { z } from "zod";

export const signupSchema = z.object({
    firstName: z.string()    
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-zÆØÅæøå\s]+$/, "Name can only contain letters and spaces"),
    lastName: z.string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-zÆØÅæøå\s]+$/, "Name can only contain letters and spaces"),
    email: z.email("Invalid email address")
    .min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;