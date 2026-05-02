import { DeviceTypes, LedValue } from '../generated/prisma';
import { prisma } from '../libs';

interface IDeviceData {
  deviceName: string;
  deviceType: DeviceTypes;
  light?: LedValue;
  temperature?: number;
}

const createDevice = async (data: IDeviceData) => {
  const device = await prisma.device.create({ data });
  return device;
};

const findDevice = async (deviceName: string) => {
  const device = await prisma.device.findUnique({ where: { deviceName } });
  return device;
};

export { createDevice, findDevice };
