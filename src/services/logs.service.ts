import { prisma } from '../libs';

interface ILogData {
  userId: number;
  deviceId: number;
  status: string;
}

const createLog = async (data: ILogData) => {
  const log = prisma.logs.create({ data });
  return log;
};

export { createLog };
