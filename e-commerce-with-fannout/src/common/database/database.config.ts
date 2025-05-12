import { env } from "./../env/setup-envs";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { AccountEntity } from "../../shared/entities/account.entity";
import { AddressEntity } from "../../shared/entities/address.entity";
import { ProductEntity } from "../../shared/entities/product.entity";
import { OrderEntity } from "../../shared/entities/order.entity";
import { OrderItemEntity } from "../../shared/entities/order-item.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "ecommerce-user",
  password: "password",
  database: "ecommerce-service-db",
  synchronize: true,
  logging: false,
  migrationsRun: false,
  entities: [
    AccountEntity,
    AddressEntity,
    ProductEntity,
    OrderEntity,
    OrderItemEntity,
  ],
});
