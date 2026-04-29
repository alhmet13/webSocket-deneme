import { prisma } from '../libs';

interface IUserData {
  name: string;
  rfid_ID: string;
}

const createUser = async (data: IUserData) => {
  const user = await prisma.user.create({ data });
  return user;
};

export { createUser };
