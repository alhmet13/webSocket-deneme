import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  rfid_ID: z.string(),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
