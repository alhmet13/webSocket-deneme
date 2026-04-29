import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS_CODE, hashPassword, signJwt, accessTokenCookieOptions, refreshTokenCookieOptions, verifyPassword, verifyJwt } from '../helpers';
import { createUser } from '../services';
import { authSchema, AuthInput } from '../schemas';
import { request } from 'http';

const signUpHandler = async (request: FastifyRequest<{ Body: AuthInput }>, reply: FastifyReply) => {
  const { name, rfid_ID } = authSchema.parse(request.body);

  try {
    await createUser({ name, rfid_ID });
    return reply.status(HTTP_STATUS_CODE.OK).send({ message: 'OK' });
  } catch (err) {
    throw err;
  }
};

export { signUpHandler };
