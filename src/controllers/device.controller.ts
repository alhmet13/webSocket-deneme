import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS_CODE } from '../helpers';
import { createDevice, findDevice, findUserById } from '../services';
import { deviceSchema, DeviceInput } from '../schemas';
import { sendCommand } from '../managers';
import { DeviceTypes } from '../generated/prisma';

const deviceCreateHandler = async (request: FastifyRequest<{ Body: DeviceInput }>, reply: FastifyReply): Promise<any> => {
  const { id } = request.user!;
  const userId = Number(id);
  const { deviceName, deviceType } = deviceSchema.parse(request.body);

  try {
    const user = await findUserById(userId);
    if (!user) {
      return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'Kullanıcı bulunamadı.' });
    }
    const userRole = user.role;

    if (userRole != 'admin') {
      return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'Bu işlemi gerçekleştirmek için yetkiniz yoktur.' });
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
  const { id } = request.user!;
  const userId = Number(id);
  const { deviceName, deviceType, light } = deviceSchema.parse(request.body);

  try {
    const device = await findDevice(deviceName);
    if (!device) {
      return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'Belirtmiş olduğunuz cihaz bulunamadı.' });
    }

    if (deviceType === 'LED') {
      if (!light) {
        return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'LED durumu belirtilmedi!' });
      }

      await sendCommand(deviceName, light, userId);
    }

    //* Yarın temperature eklediğinde buraya sadece bir 'else if' gelecek:
    //? else if (deviceType === 'TEMP') { await sendCommand(deviceName, 'read'); }

    return reply.status(HTTP_STATUS_CODE.OK).send({ message: 'OK' });
  } catch (err) {
    throw err;
  }
};

export { deviceCreateHandler, runDeviceHandler };
