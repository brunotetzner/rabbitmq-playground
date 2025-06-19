import { OrderEntity } from "./../../../shared/entities/order.entity";
import { Repository } from "typeorm";
import { AccountEntity } from "../../../shared/entities/account.entity";
import { AppDataSource } from "../../../common/database/database.config";
import { OrderItemEntity } from "../../../shared/entities/order-item.entity";
import { CreateSaleDto } from "../DTOs/create-sale.dto";
import { Request } from "express";
import { SaleStatusEnum } from "../../../shared/enums/sale-status.enum";
import { ProductEntity } from "../../../shared/entities/product.entity";
import { AddressEntity } from "../../../shared/entities/address.entity";
import { RabbitMQBroker } from "../../../mechanisms/rabbitmq";
import { exchangeTypeEnum } from "../../../mechanisms/rabbitmq";

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

  async execute(req: Request, body: CreateSaleDto): Promise<void> {
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
      order.shippingAddress = shippingAddressEntity;
      const orderEntity = await this.orderEntityRepository.save(order);

      order.items = [];
      let totalOrderPrice = 0;
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

        totalOrderPrice += orderItem.totalPrice;
      }
      order.totalPrice = totalOrderPrice;
      await this.orderEntityRepository.update(orderEntity.id, {
        totalPrice: totalOrderPrice,
      });
      await this.publishToBroker(account, orderEntity);
    } catch (error) {
      throw error;
    }
  }

  private async publishToBroker(account: AccountEntity, order: OrderEntity) {
    const broker = new RabbitMQBroker("amqp.fanout");
    const message = {
      totalPrice: order.totalPrice,
      accountId: account.id,
      orderId: order.id,
    };

    await broker.sendFanout(message);
  }
}
