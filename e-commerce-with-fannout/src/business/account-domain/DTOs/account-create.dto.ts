import { Type } from "class-transformer";
import {
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";

export class ShippingAddressDto {
  @IsString()
  zipCode: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  number: number;
}

export class AccountCreateDto {
  @IsString()
  @MaxLength(120)
  email: string;

  @MinLength(8)
  password: string;

  @MaxLength(120)
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;
}
