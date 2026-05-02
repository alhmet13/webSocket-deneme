import { prisma } from '../libs';
import { Roles } from '../generated/prisma';

interface IUserData {
  name: string;
  email: string;
  password: string;
  rfid_ID: string;
  role: Roles;
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
  const user = prisma.user.findUnique({ where: { id: userId }, select: { id: true, uuid: true, name: true, email: true, role: true } });
  return user;
};

const findUserByRfid_ID = async (rfid_ID: string) => {
  const user = await prisma.user.findUnique({ where: { rfid_ID } });
  return user;
};

const changePassword = async (id: number, data: { password: string }) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(data.password && { password: data.password }),
    },
  });
  return user;
};

export { createUser, findUser, findUserById, findUserByRfid_ID, changePassword };
