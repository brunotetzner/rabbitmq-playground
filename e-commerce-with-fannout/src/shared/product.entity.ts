import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column()
  description: string;
}
