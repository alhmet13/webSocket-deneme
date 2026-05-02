import { SrvRecord } from 'dns';
import { prisma } from '../libs';

interface IUserData {
  name: string;
  email: string;
  password: string;
  rfid_ID: string;
}

const createUser = async (data: IUserData) => {
  const user = await prisma.user.create({ data });
  return user;
};

const findUser = async (email: string) => {
  const user = prisma.user.findUnique({ where: { email } });
  return user;
};

const findUserById = async (userId: number) => {
  const user = prisma.user.findUnique({ where: { id: userId }, select: { id: true, uuid: true, name: true, email: true } });
  return user;
};

const findUserByRfid_ID = async (rfid_ID: string) => {
  const user = await prisma.user.findUnique({ where: { rfid_ID } });
  return user;
};

export { createUser, findUser, findUserById, findUserByRfid_ID };
