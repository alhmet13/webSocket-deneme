import { randomTemperature } from '../helpers';
import { createDevice } from '../services';
import { deviceSchema } from '../schemas';

const deviceSimulation = () => {
  try {
    setInterval(async () => {
      const temp = randomTemperature();

      const rawData = {
        deviceName: 'DVC-001',
        temperature: temp,
      };

      const validatedData = deviceSchema.parse(rawData);

      const newRecord = await createDevice(validatedData);

      return newRecord;
    }, 10000);
  } catch (error) {
    throw error;
  }
};

export { deviceSimulation };
