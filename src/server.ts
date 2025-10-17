import express from "express";
import { prisma } from "./db/prisma";
import 'colors'

import { config } from "./config/config";
import AuthRouter from "./auth/auth.routes"

const app = express();

async function main() {
  await prisma.$connect()
  app.use(express.json())

  app.use('/api', AuthRouter)

  app.listen(
    config.port,
    () => {
      console.log(`Server running at http://localhost:${config.port}`.green.bold);
    }
  );
}

main()
  .catch(async (error) => {
    console.log(error)
    await prisma.$disconnect()
    process.exit(1)
  })