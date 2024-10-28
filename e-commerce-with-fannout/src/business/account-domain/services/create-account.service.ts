import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { AccountEntity } from "../../../shared/account.entity";
import { AppDataSource } from "../../../common/database/database.config";

export class CreateAccountService {
  private accountRepository: Repository<AccountEntity>;

  constructor() {
    this.accountRepository = AppDataSource.getRepository(AccountEntity);
  }

  async execute(
    email: string,
    password: string,
    name: string
  ): Promise<AccountEntity> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const account = this.accountRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    await this.accountRepository.save(account);
    return account;
  }
}
