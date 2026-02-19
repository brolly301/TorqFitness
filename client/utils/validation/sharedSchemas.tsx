// import * as z from "zod/v4";

// export const emailSchema = z
//   .email("Please enter a valid email address")
//   .nonempty("Email is required.");

// export const passwordSchema = z
//   .string("Password is required.")
//   .min(8, "Password must be at least 8 characters.")
//   .refine(
//     (val) => /[A-Z]/.test(val),
//     "Password must include an uppercase character.",
//   )
//   .refine(
//     (val) => /[a-z]/.test(val),
//     "Password must include a lowercase character.",
//   )
//   .refine((val) => /\d/.test(val), "Password must include a number.")
//   .refine(
//     (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
//     "Password must include a special character.",
//   );

// export const firstNameSchema = z
//   .string("First name is required.")
//   .nonempty("First name is required.")
//   .max(30, "First name must not exceed 30 characters.");

// export const surnameSchema = z
//   .string("Name is required.")
//   .nonempty("Name is required.")
//   .max(30, "Surname must not exceed 30 characters.");
