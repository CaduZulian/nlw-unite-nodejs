import { prisma } from "../src/lib";

async function seed() {
  await prisma.event.create({
    data: {
      id: "6a8aba1c-e109-4c45-ad3f-039685ec8d86",
      title: "Unite Summit",
      slug: "unite-summit",
      details: "Um evento para devs apaixonados por código!",
      maximumAttendees: 120,
    },
  });
}

seed().then(() => {
  console.log("Database seeded.");
  prisma.$disconnect();
});
