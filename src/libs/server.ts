import Fastify, { FastifyError } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import formBody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import websocket from '@fastify/websocket';
import { logger } from '../libs';
import { API_ROUTES, API_VERSION, HTTP_STATUS_CODE } from '../helpers';
import deviceSocket from '../sockets/device.socket';
import { initArduinoListener } from '../listeners/serial.listener';
import { authRoutes, deviceRoutes } from '../routes';

const { PORT, NODE_ENV } = process.env;

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  exposedHeaders: ['Content-Disposition'],
};

const server = async () => {
  const app = Fastify({
    trustProxy: true,
    logger: { level: NODE_ENV === 'development' ? 'info' : 'warn' },
  });

  // Security headers
  app.register(helmet);

  // Core plugins
  app.register(cors, corsOptions);
  app.register(cookie, {
    parseOptions: {},
  });
  app.register(formBody);

  await app.register(websocket);

  await app.register(deviceSocket);

  // Root route
  app.get('/', async (_req, reply) => {
    return reply.status(HTTP_STATUS_CODE.OK).send('OK');
  });

  // Routes with prefix
  app.register(authRoutes, { prefix: `${API_VERSION.V1}${API_ROUTES.AUTH}` });
  app.register(deviceRoutes, { prefix: `${API_VERSION.V1}${API_ROUTES.DEVICE}` });

  // 404 handler
  app.setNotFoundHandler((_req, reply) => {
    reply.status(HTTP_STATUS_CODE.NOT_FOUND).send({
      message: 'Route not found',
    });
  });

  // Global error handler
  app.setErrorHandler((error: FastifyError, _req, reply) => {
    logger.error(error);

    const statusCode = error.statusCode ?? HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
    const message = statusCode === HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR ? 'Some Server Error :)' : error.message;

    reply.status(statusCode).send({ message });
  });

  await app.listen({ port: parseInt(PORT || '8080', 10), host: '0.0.0.0' });
  logger.info(`[FASTIFY APP] Server listening on port ${PORT}`);

  initArduinoListener((newRecord) => {
    app.broadcastDeviceData(newRecord);

    logger.info(`[ARDUINO -> SOCKET] Veri basariyla yayinlandi. Cihaz: ${newRecord.deviceName}, Isik durumu: ${newRecord.light}`);
  });

  return app;
};

export { server };
