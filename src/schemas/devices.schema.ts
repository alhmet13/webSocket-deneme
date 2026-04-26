import { z } from 'zod';

export const deviceSchema = z.object({
  deviceName: z.string(),
  temperature: z.number(),
});

export type DeviceInput = z.infer<typeof deviceSchema>;
