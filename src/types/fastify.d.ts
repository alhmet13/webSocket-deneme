import 'fastify';

export interface DecodedUser {
  id: number;
  uuid: string;
  email: string;
  name: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: DecodedUser;
  }

  interface FastifyInstance {
    broadcastDeviceData: (data: any) => void;
  }
}
