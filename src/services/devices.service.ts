import { prisma } from '../libs';

interface IDeviceData {
  deviceName: string;
  temperature: number;
}

const createDevice = async (data: IDeviceData) => {
  const device = await prisma.device.create({ data });
  return device;
};

export { createDevice };
