import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column({ type: "varchar" })
  stock: number;

  @Column({ type: "varchar" })
  description: string;
}
