import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(30, "Username must not exceed 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username must only contain alphanumeric characters and underscores"
  );

export const emailValidation = z
  .string()
  .email({ message: "Please provide a valid email address" });

export const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});
