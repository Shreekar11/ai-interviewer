import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  await client.user.create({
    data: {
      name: "John Doe",
      email: "john.doe#example.com",
    },
  });
}

main();