import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";

const app = fastify();

const prisma = new PrismaClient({
  log: ["query"],
});

app.post("/events", async (request, reply) => {
  const schema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  });

  const data = schema.parse(request.body);

  const event = await prisma.event.create({
    data: {
      ...data,
      slug: data.title.toLowerCase().replace(/ /g, "-"),
    },
  });

  return reply.code(201).send(event);
});

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server is running on port 3333!");
});
