import { IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class SaleItemDTO {
  @IsNumber({ maxDecimalPlaces: 0 })
  id: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  quantity: number;
}

export class CreateSaleDto {
  @ValidateNested()
  @Type(() => SaleItemDTO)
  items: SaleItemDTO[];

  @IsNumber({ maxDecimalPlaces: 0 })
  shippingAddressId: number;
}
