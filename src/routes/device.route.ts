import { FastifyPluginAsync } from 'fastify';
import { deviceCreateHandler, runDeviceHandler } from '../controllers/device.controller';
import { DeviceInput } from '../schemas';
import { authentication } from '../plugins/authentication';

export const deviceRoutes: FastifyPluginAsync = async (fastify, _) => {
  fastify.post<{ Body: DeviceInput }>('/create', { preHandler: [authentication] }, deviceCreateHandler);
  fastify.post<{ Body: DeviceInput }>('/run', { preHandler: [authentication] }, runDeviceHandler);
};
