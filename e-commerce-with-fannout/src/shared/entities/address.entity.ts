import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity()
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @ManyToOne(() => AccountEntity, (account) => account.addresses)
  account: AccountEntity;
}
