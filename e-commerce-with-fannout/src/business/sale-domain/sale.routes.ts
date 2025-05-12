import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/validate-token";
import { SaleController } from "./controllers/sale.controller";
import { validateDto } from "../../common/middlewares/validate-dto";
import { CreateSaleDto } from "./DTOs/create-sale.dto";

const saleRouter = Router();
const saleController = new SaleController();

const prefix = "/sale";

saleRouter.post(
  `${prefix}`,
  authMiddleware,
  validateDto(CreateSaleDto),

  (req, res) => saleController.createSale(req, res)
);

export default saleRouter;
