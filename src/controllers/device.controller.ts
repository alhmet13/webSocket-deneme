import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS_CODE } from '../helpers';
import { createDevice, findDevice } from '../services';
import { deviceSchema, DeviceInput } from '../schemas';
import { sendCommand } from '../managers';
import { DeviceTypes, LedValue } from '../generated/prisma';

const deviceCreateHandler = async (request: FastifyRequest<{ Body: DeviceInput }>, reply: FastifyReply): Promise<any> => {
  const { deviceName, deviceType } = deviceSchema.parse(request.body);

  try {
    if (!deviceName || !deviceType) {
      return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'deviceName ve deviceType boş bırakılmamalıdır!' });
    }

    if (!Object.values(DeviceTypes).includes(deviceType)) {
      return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: `Geçersiz cihaz türü: ${deviceType}` });
    }

    await createDevice({ deviceName, deviceType });

    return reply.status(HTTP_STATUS_CODE.OK).send({ message: 'OK' });
  } catch (err) {
    throw err;
  }
};

const runDeviceHandler = async (request: FastifyRequest<{ Body: DeviceInput }>, reply: FastifyReply): Promise<any> => {
  const { deviceName, deviceType, light } = deviceSchema.parse(request.body);

  try {
    if (deviceType === 'LED') {
      if (!light) {
        return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'LED durumu belirtilmedi!' });
      }

      await sendCommand(deviceName, light);
    }

    //* Yarın temperature eklediğinde buraya sadece bir 'else if' gelecek:
    //? else if (deviceType === 'TEMP') { await sendCommand(deviceName, 'read'); }

    return reply.status(HTTP_STATUS_CODE.OK).send({ message: 'OK' });
  } catch (err) {
    throw err;
  }
};

export { deviceCreateHandler, runDeviceHandler };
