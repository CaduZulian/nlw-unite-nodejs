import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastify from "fastify";

import {
  createEvent,
  getAttendeeBadge,
  getEvent,
  registerForEvent,
} from "./routes";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server is running on port 3333!");
});
