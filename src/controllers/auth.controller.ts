import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS_CODE, hashPassword, signJwt, accessTokenCookieOptions, refreshTokenCookieOptions, verifyPassword, verifyJwt } from '../helpers';
import { createUser, findUser, findUserById, changePassword } from '../services';
import {
  signUpSchema,
  SignUpInput,
  signInSchema,
  SignInInput,
  createUserSchema,
  CreateUserInput,
  changePasswordSchema,
  ChangePasswordInput,
} from '../schemas';

const signUpHandler = async (request: FastifyRequest<{ Body: SignUpInput }>, reply: FastifyReply) => {
  const { name, email, password, rfid_ID } = signUpSchema.parse(request.body);

  try {
    const hashedPassword = await hashPassword(password);
    await createUser({ name, email, password: hashedPassword, rfid_ID, role: 'admin' });
    return reply.status(HTTP_STATUS_CODE.OK).send({ message: 'OK' });
  } catch (err) {
    throw err;
  }
};

const signInHandler = async (request: FastifyRequest<{ Body: SignInInput }>, reply: FastifyReply): Promise<any> => {
  const { email, password } = signInSchema.parse(request.body);

  try {
    const user = await findUser(email);
    if (!user) {
      return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'Geçersiz email.' });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return reply.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Geçersiz şifre.' });
    }

    const accessToken = signJwt({ userId: user.id, email: user.email }, 'access', { expiresIn: '15m' });
    const refreshToken = signJwt({ userId: user.id, email: user.email }, 'refresh', { expiresIn: '7d' });

    reply.cookie('access_token', accessToken, accessTokenCookieOptions);
    reply.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);

    return reply.status(HTTP_STATUS_CODE.OK).send({ message: 'OK' });
  } catch (error) {
    throw error;
  }
};

const createUserHandler = async (request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply): Promise<any> => {
  const { name, email, password, rfid_ID, role } = createUserSchema.parse(request.body);
  const { id } = request.user!;
  const userId = Number(id);

  try {
    const user = await findUserById(userId);
    if (!user) {
      return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'Kullanıcı bulunamadı.' });
    }
    const userRole = user.role;
    if (userRole != 'admin') {
      return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'Bu işlemi gerçekleştirmek için yetkiniz yoktur.' });
    }

    const hashedPassword = await hashPassword(password);

    await createUser({ name, email, password: hashedPassword, rfid_ID, role });

    return reply.status(HTTP_STATUS_CODE.OK).send({ message: 'OK' });
  } catch (err) {
    throw err;
  }
};

const changePasswordHandler = async (request: FastifyRequest<{ Body: ChangePasswordInput }>, reply: FastifyReply): Promise<any> => {
  const { id } = request.user!;
  const userId = Number(id);
  const { password } = changePasswordSchema.parse(request.body);

  try {
    if (!userId) {
      return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: "Şifresi değiştirilecek kullanıcının id'si bulunamadı" });
    }

    const hashedPassword = await hashPassword(password);

    await changePassword(userId, { password: hashedPassword });

    return reply.status(HTTP_STATUS_CODE.OK).send({ message: 'OK' });
  } catch (err) {
    throw err;
  }
};

export { signUpHandler, signInHandler, createUserHandler, changePasswordHandler };
