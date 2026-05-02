import { z } from 'zod';

export const deviceSchema = z.object({
  deviceName: z.string(),
  deviceType: z.enum(['LED', 'Temperature']),
  light: z.enum(['on', 'off']).optional(),
  temperature: z.number().optional(),
});

export type DeviceInput = z.infer<typeof deviceSchema>;
