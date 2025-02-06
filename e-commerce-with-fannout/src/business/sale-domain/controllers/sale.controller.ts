import { Request, Response } from "express";
import { CreateSaleService } from "../services/create-sale.service";

export class SaleController {
  private createSaleService: CreateSaleService;

  constructor() {
    this.createSaleService = new CreateSaleService();
  }

  async createSale(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.createSaleService.execute(req, req.body);

      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: "Erro ao criar venda", error });
    }
  }
}
