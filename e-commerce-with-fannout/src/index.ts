import express, { Request, Response } from "express";
import { AppDataSource } from "./common/database/database.config";

async function main() {
  await AppDataSource.initialize();
}
const app = express();
const port = 3000;

main();

// Endpoint GET
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello, world!" });
});

// Inicializando o servidor
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});
