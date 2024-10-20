import "reflect-metadata";
import { DataSource } from "typeorm";
import { AccountEntity } from "../../shared/account.entity";
import { AddressEntity } from "../../shared/address.entity";
import { ProductEntity } from "../../shared/product.entity";
import { OrderEntity } from "../../shared/order.entity";
import { OrderItemEntity } from "../../shared/order-item.entity";

export const AppDataSource = new DataSource({
  type: "postgres", // ou outro tipo de banco de dados, ex: sqlite, mysql
  host: "localhost",
  port: 5432,
  username: "ecommerce-user",
  password: "password",
  database: "ecommerce-service-db",
  synchronize: true, // Defina como true apenas para desenvolvimento, false em produção
  logging: true,
  migrationsRun: false,
  entities: [
    AccountEntity,
    AddressEntity,
    ProductEntity,
    OrderEntity,
    OrderItemEntity,
  ],
});
