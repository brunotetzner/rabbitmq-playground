import { Request, Response } from "express";
import { CreateAccountService } from "../services/create-account.service";
import { AuthService } from "../services/authenticate-account.service";
import { AccountDetailsService } from "../services/get-account-details.service";
import { AccountCreateDto } from "../DTOs/account-create.dto";

export class AccountController {
  private accountService: CreateAccountService;
  private authService: AuthService;
  private accountDetailsService: AccountDetailsService;
  constructor() {
    this.accountService = new CreateAccountService();
    this.authService = new AuthService();
    this.accountDetailsService = new AccountDetailsService();
  }

  async createAccount(req: Request, res: Response): Promise<void> {
    const { email, password, name, shippingAddress }: AccountCreateDto =
      req.body;

    try {
      const account = await this.accountService.execute(
        email,
        password,
        name,
        shippingAddress
      );
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ message: "Erro ao criar conta", error });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const token = await this.authService.login(email, password);

      if (!token) {
        res.status(401).json({ message: "Credenciais inválidas" });
        return;
      }

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Erro ao realizar login", error });
    }
  }
  async getAccountDetails(req: Request, res: Response): Promise<void> {
    const userId = req.user.id;
    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const accountDetails = await this.accountDetailsService.getAccountDetails(
      userId
    );

    if (!accountDetails) {
      res.status(404).json({ message: "Conta não encontrada." });
      return;
    }

    res.status(200).json(accountDetails);
  }
}
