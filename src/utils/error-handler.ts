import { FastifyInstance } from "fastify";
import { BadRequest } from "../routes/_errors";
import { ZodError } from "zod";

export const errorHandler: FastifyInstance["errorHandler"] = async (
  error,
  request,
  reply
) => {
  if (error instanceof ZodError) {
    return reply.code(400).send({
      error: `Error during validation`,
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadRequest) {
    reply.code(400).send({
      error: error.message,
    });
  } else {
    reply.code(500).send({
      error: "Internal server error",
    });
  }
};
