import { Types } from "mongoose";
import { z } from "zod";

export enum UserRole {
  "user" = "user",
  "admin" = "admin",
}

export const userZodSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6), // you can tweak min length as needed
  role: z.nativeEnum(UserRole).default(UserRole.user),
  isVerified: z.boolean().default(false),
  verificationToken: z.string().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.date().optional(),
  // timestamps added by Mongoose
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const userInputSchema = userZodSchema.omit({
  role: true,
  isVerified: true,
  verificationToken: true,
  resetPasswordExpires: true,
  resetPasswordToken: true,
  createdAt: true,
  updatedAt: true,
});

export const userLoginSchema = userInputSchema.omit({
  name: true
})

export type UserType = z.infer<typeof userZodSchema>;
export type UserInputType = z.infer<typeof userInputSchema>;
export type UserLoginType = z.infer<typeof userLoginSchema>

// ***************** Other Types ******************

export type JwtUserPayload = {
  id: string | Types.ObjectId;
  role: UserRole;
  name: string;
  email: string;
  iat?: number;
  exp?: number
}