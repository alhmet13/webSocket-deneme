import { z } from 'zod';

export const authSchema = z.object({
  name: z.string(),
  rfid_ID: z.string(),
});

export type AuthInput = z.infer<typeof authSchema>;
