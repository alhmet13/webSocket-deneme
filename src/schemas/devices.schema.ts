import { z } from 'zod';

export const deviceSchema = z.object({
  deviceName: z.string(),
  deviceType: z.string(),
});

export type DeviceInput = z.infer<typeof deviceSchema>;
