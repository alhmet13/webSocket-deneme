import { FastifyPluginAsync } from 'fastify';
import { signUpHandler, signInHandler, createUserHandler, changePasswordHandler } from '../controllers/auth.controller';
import { CreateUserInput, ChangePasswordInput } from '../schemas';
import { authentication } from '../plugins/authentication';

export const authRoutes: FastifyPluginAsync = async (fastify, _) => {
  fastify.post('/sign-up', signUpHandler);
  fastify.post('/sign-in', signInHandler);
  fastify.post<{ Body: CreateUserInput }>('/create-user', { preHandler: [authentication] }, createUserHandler);
  fastify.patch<{ Body: ChangePasswordInput }>('/change-password', { preHandler: [authentication] }, changePasswordHandler);
};
