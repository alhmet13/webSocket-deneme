import { z, ZodError } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTP_STATUS_CODE } from '../helpers';

function validate(schema: z.ZodObject<any, any>) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // Body'yi Zod şemasıyla doğrula
      schema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));

        return reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ error: 'Invalid data', details: errorMessages });
      }

      return reply.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
    }
  };
}

export { validate };
