import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS_CODE, verifyJwt } from '../helpers';
import { findUserById } from '../services';

export const authentication = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.cookies.access_token;
    console.log('TOKEN:', token);

    if (!token) {
      return reply.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Token Bulunamadı!' });
    }

    const decoded = verifyJwt(token, 'access');
    if (!decoded || !decoded.userId) {
      return reply.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Token Geçersiz!' });
    }

    const user = await findUserById(decoded.userId);
    if (!user) {
      return reply.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Kullanıcı Bulunamadı!' });
    }

    request.user = user;
  } catch (error) {
    return reply.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Sunucu Hatası' });
  }
};
