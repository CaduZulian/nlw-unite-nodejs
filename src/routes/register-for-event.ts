import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../lib";

import { BadRequest } from "./_errors";

export const registerForEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Register an attendee",
        tags: ["attendees"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number().int(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const data = request.body;

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          email_eventId: {
            email: data.email,
            eventId,
          },
        },
      });

      if (attendeeFromEmail !== null) {
        throw new BadRequest("This e-mail is already registered for this event.");
      }

      const [event, amountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId,
          },
        }),
        prisma.attendee.count({
          where: {
            eventId,
          },
        }),
      ]);

      if (
        event?.maximumAttendees &&
        amountOfAttendeesForEvent >= event?.maximumAttendees
      ) {
        throw new BadRequest("The event is already full.");
      }

      const attendee = await prisma.attendee.create({
        data: {
          ...data,
          eventId,
        },
      });

      return reply.code(201).send({
        attendeeId: attendee.id,
      });
    }
  );
};
