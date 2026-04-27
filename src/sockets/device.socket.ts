import { FastifyInstance, FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';
import { WebsocketHandler } from '@fastify/websocket';
import fp from 'fastify-plugin';

async function deviceSocket(fastify: FastifyInstance) {
  fastify.decorate('broadcastDeviceData', (data: any) => {
    const wss = fastify.websocketServer;

    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  fastify.get('/ws', { websocket: true }, (socket: WebSocket, req: FastifyRequest) => {
    fastify.log.info('Yeni bir istemci bağlandı!');

    socket.on('close', () => {
      fastify.log.info('İstemci ayrıldı.');
    });

    socket.on('error', (err: Error) => {
      fastify.log.error({ err }, 'Socket hatası:');
    });
  });
}

export default fp(deviceSocket);
