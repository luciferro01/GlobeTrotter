import { PrismaClient } from "@prisma/client";
import { env } from "process";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

export { prisma };

// Since you have the prisma schema and the context on how to create apis using encore.dev create the services (apis) using this
