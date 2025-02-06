import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/validate-token";
import { SaleController } from "./controllers/sale.controller";

const saleRouter = Router();
const saleController = new SaleController();

const prefix = "/sale";

saleRouter.post(`${prefix}`, authMiddleware, (req, res) =>
  saleController.createSale(req, res)
);

export default saleRouter;
