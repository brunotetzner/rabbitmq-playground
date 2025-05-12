import { Repository } from "typeorm";
import { AccountEntity } from "../../../shared/entities/account.entity";
import { AppDataSource } from "../../../common/database/database.config";

export class AccountDetailsService {
  private accountRepository: Repository<AccountEntity>;

  constructor() {
    this.accountRepository = AppDataSource.getRepository(AccountEntity);
  }

  async getAccountDetails(userId: number): Promise<AccountEntity | null> {
    return await this.accountRepository.findOne({ where: { id: userId } });
  }
}
