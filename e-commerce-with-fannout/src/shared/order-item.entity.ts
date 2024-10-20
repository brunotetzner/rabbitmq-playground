import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "./product.entity";

@Entity()
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;

  @Column()
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  totalPrice: number; // quantity * product price
}
