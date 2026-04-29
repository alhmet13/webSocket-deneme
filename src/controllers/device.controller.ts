import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS_CODE } from '../helpers';
import { createDevice } from '../services';
import { deviceSchema, DeviceInput } from '../schemas';

const deviceCreateHandler = async (request: FastifyRequest<{ Body: DeviceInput }>, reply: FastifyReply): Promise<any> => {
  const { deviceName, deviceType } = deviceSchema.parse(request.body);

  try {
    await createDevice({ deviceName, deviceType });

    return reply.status(HTTP_STATUS_CODE.OK).send({ message: 'OK' });
  } catch (err) {
    throw err;
  }
};

export { deviceCreateHandler };
