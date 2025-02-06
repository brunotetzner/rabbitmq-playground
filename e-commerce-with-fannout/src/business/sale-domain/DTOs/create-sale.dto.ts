import { OrderItemEntity } from "../../../shared/order-item.entity";

export class CreateSaleDto {
  items: OrderItemEntity[];
  shippingAddressId: number;
}
