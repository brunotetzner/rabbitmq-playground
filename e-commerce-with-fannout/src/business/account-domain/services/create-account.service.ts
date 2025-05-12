import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { AccountEntity } from "../../../shared/entities/account.entity";
import { AppDataSource } from "../../../common/database/database.config";
import { AddressEntity } from "../../../shared/entities/address.entity";
import { ShippingAddressDto } from "../DTOs/account-create.dto";

export class CreateAccountService {
  private accountRepository: Repository<AccountEntity>;
  private addressRepository: Repository<AddressEntity>;

  constructor() {
    this.accountRepository = AppDataSource.getRepository(AccountEntity);
    this.addressRepository = AppDataSource.getRepository(AddressEntity);
  }

  async execute(
    email: string,
    password: string,
    name: string,
    address: ShippingAddressDto
  ): Promise<AccountEntity> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const account = new AccountEntity();
    account.email = email;
    account.password = hashedPassword;
    account.name = name;

    await this.accountRepository.save(account);

    const savedAccount = await this.accountRepository.findOne({
      where: { email, name },
    });
    if (!savedAccount) {
      throw new Error("Error recovering saved account");
    }

    const addressEntity = new AddressEntity();

    addressEntity.state = address.state;
    addressEntity.street = address.street;
    addressEntity.city = address.city;
    addressEntity.zipCode = address.zipCode;
    address.number = address.number;
    addressEntity.account = savedAccount;

    await this.addressRepository.save(address);
    return account;
  }
}
