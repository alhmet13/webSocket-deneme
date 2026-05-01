import { FastifyPluginAsync } from 'fastify';
import { signUpHandler, signInHandler } from '../controllers/auth.controller';

export const authRoutes: FastifyPluginAsync = async (fastify, _) => {
  fastify.post('/sign-up', signUpHandler);
  fastify.post('/sign-in', signInHandler);
};
