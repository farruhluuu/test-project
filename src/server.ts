import express from "express";
import dotenv from "dotenv"
import 'colors'
import { configure } from "express-route-list";

const app = express();

dotenv.config()

async function main() {
  app.use(express.json())

  const PORT = process.env.PORT || 3000

  app.listen(
    PORT,
    () => {
      console.log(`Server running at http://localhost:${PORT}`.green.bold);
      configure(app)
    }
  );
}

main()