import { prisma } from '../libs';

interface IUserData {
  name: string;
  rfid_ID: string;
}

const createUser = async (data: IUserData) => {
  const user = await prisma.user.create({ data });
  return user;
};

const findUserByRfid_ID = async (rfid_ID: string) => {
  const user = await prisma.user.findUnique({ where: { rfid_ID } });
  return user;
};

export { createUser, findUserByRfid_ID };
