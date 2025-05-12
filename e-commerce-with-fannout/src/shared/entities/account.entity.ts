import { AddressEntity } from "./address.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => AddressEntity, (address) => address.account)
  addresses: AddressEntity[];

  @OneToMany(() => OrderEntity, (order) => order.account)
  orders: OrderEntity[];
}
