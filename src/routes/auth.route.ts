import { FastifyPluginAsync } from 'fastify';
import { signUpHandler } from '../controllers/auth.controller';

export const authRoutes: FastifyPluginAsync = async (fastify, _) => {
  fastify.post('/sign-up', signUpHandler);
};
