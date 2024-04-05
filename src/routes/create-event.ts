import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../lib";

import { generateSlug } from "../utils";

import { BadRequest } from "./_errors";

export const createEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullish(),
          maximumAttendees: z.number().int().positive().nullish(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const data = request.body;

      const slug = generateSlug(data.title);

      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug,
        },
      });

      if (eventWithSameSlug !== null) {
        throw new BadRequest("An event with the same title already exists.");
      }

      const event = await prisma.event.create({
        data: {
          ...data,
          slug,
        },
      });

      return reply.code(201).send({
        eventId: event.id,
      });
    }
  );
};
