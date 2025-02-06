import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AccountEntity } from "../../../shared/account.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/database/database.config";
import { env } from "../../../common/env/setup-envs";

export class AuthService {
  private jwtSecret: string;
  private accountRepository: Repository<AccountEntity>;

  constructor() {
    this.accountRepository = AppDataSource.getRepository(AccountEntity);
    this.jwtSecret = env.JWT_PRIVATE_KEY; // Use diretamente
  }

  async login(email: string, password: string): Promise<string | null> {
    const account = await this.accountRepository.findOne({ where: { email } });
    console.log("here", this.jwtSecret);
    if (!account) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      return null;
    }

    try {
      const token = jwt.sign(
        { id: account.id, email: account.email },
        this.jwtSecret,
        {
          expiresIn: "1h",
          algorithm: "RS256",
        }
      );

      return token;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
