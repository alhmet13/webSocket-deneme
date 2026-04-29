import { FastifyPluginAsync } from 'fastify';
import { deviceCreateHandler } from '../controllers/device.controller';

export const deviceRoutes: FastifyPluginAsync = async (fastify, _) => {
  fastify.post('/create', deviceCreateHandler);
};
