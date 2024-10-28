import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { AppDataSource } from "./common/database/database.config";
import accountRouter from "./business/account-domain/account.routes";

async function main() {
  await AppDataSource.initialize();
}
const app = express();
const port = 3000;
app.use(express.json());

main();

app.use("/api", accountRouter);
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});
