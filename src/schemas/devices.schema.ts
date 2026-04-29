import { z } from 'zod';

export const deviceSchema = z.object({
  deviceName: z.string(),
  light: z.boolean(),
});

export type DeviceInput = z.infer<typeof deviceSchema>;
