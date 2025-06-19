import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { AccountEntity } from "./account.entity";
import { OrderItemEntity } from "./order-item.entity";
import { AddressEntity } from "./address.entity";

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string; // ex: 'processing', 'completed', 'cancelled'

  @ManyToOne(() => AccountEntity, (account) => account.orders)
  account: AccountEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  items: OrderItemEntity[];

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @ManyToOne(() => AddressEntity)
  shippingAddress: AddressEntity;
}
