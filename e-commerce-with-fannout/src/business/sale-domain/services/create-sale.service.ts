import { Repository } from "typeorm";
import { AccountEntity } from "../../../shared/account.entity";
import { AppDataSource } from "../../../common/database/database.config";
import { OrderItemEntity } from "../../../shared/order-item.entity";
import { OrderEntity } from "../../../shared/order.entity";
import { CreateSaleDto } from "../DTOs/create-sale.dto";
import { Request } from "express";
import { SaleStatusEnum } from "../../../shared/enums/sale-status.enum";
import { ProductEntity } from "../../../shared/product.entity";
import { AddressEntity } from "../../../shared/address.entity";

export class CreateSaleService {
  private accountRepository: Repository<AccountEntity>;
  private orderEntityRepository: Repository<OrderEntity>;
  private productRepository: Repository<ProductEntity>;
  private addressRepository: Repository<AddressEntity>;

  constructor() {
    this.accountRepository = AppDataSource.getRepository(AccountEntity);
    this.orderEntityRepository = AppDataSource.getRepository(OrderEntity);
    this.productRepository = AppDataSource.getRepository(ProductEntity);
    this.addressRepository = AppDataSource.getRepository(AddressEntity);
  }

  async execute(req: Request, body: CreateSaleDto): Promise<OrderEntity> {
    try {
      const { items, shippingAddressId } = body;
      const order = new OrderEntity();
      order.status = SaleStatusEnum.PENDING_PAYMENT;

      // Fetch account
      const account = await this.accountRepository.findOne({
        where: { id: req.user.id },
      });
      if (!account) {
        throw new Error("Account not found");
      }

      const shippingAddressEntity = await this.addressRepository.findOne({
        where: { id: shippingAddressId },
      });
      if (!shippingAddressEntity) {
        throw new Error("Shipping address not found");
      }

      order.account = account;

      await this.orderEntityRepository.save(order);

      order.items = [];

      for (const item of items) {
        const product = await this.productRepository.findOne({
          where: { id: item.id },
        });
        if (!product) {
          throw new Error("Product not found");
        }

        const orderItem = new OrderItemEntity();
        orderItem.product = product;
        orderItem.quantity = item.quantity;
        orderItem.totalPrice = Number(
          (item.quantity * product.price).toFixed(2)
        );
        orderItem.order = order;

        await AppDataSource.getRepository(OrderItemEntity).save(orderItem);
        order.items.push(orderItem);
      }

      return order;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
