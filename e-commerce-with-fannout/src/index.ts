import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./common/database/database.config";
import accountRouter from "./business/account-domain/account.routes";
import saleRouter from "./business/sale-domain/sale.routes";
import { ProcessPaymentService } from "./business/payment-domain/services/process-payment.service";

async function main() {
  await AppDataSource.initialize();
}
const app = express();
const port = 3000;
app.use(express.json());

main();
ProcessPaymentService.execute();

app.use("/api", accountRouter, saleRouter);
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});
