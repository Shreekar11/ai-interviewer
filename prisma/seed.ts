import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  await client.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      clerkUserId: "user_123XYZ",
    },
  });
}

main();
