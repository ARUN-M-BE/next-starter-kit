import { z } from "zod";

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid E.164 phone number (e.g. +919876543210 or 9876543210)"),
});

export const otpSchema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().max(200, "Bio cannot exceed 200 characters").optional().nullable(),
  address: z.string().max(100, "Address cannot exceed 100 characters").optional().nullable(),
  city: z.string().max(50, "City cannot exceed 50 characters").optional().nullable(),
  state: z.string().max(50, "State cannot exceed 50 characters").optional().nullable(),
  country: z.string().max(50, "Country cannot exceed 50 characters").optional().nullable(),
  zipCode: z.string().max(10, "Zip code cannot exceed 10 characters").optional().nullable(),
  avatar: z.string().url("Invalid avatar URL").optional().nullable().or(z.literal("")),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
