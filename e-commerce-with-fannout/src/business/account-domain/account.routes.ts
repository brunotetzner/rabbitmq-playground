import { Router } from "express";
import { AccountController } from "./controllers/account.controller";
import { authMiddleware } from "../../common/middlewares/validate-token";
import { validateDto } from "../../common/middlewares/validate-dto";
import { AccountCreateDto } from "./DTOs/account-create.dto";

const accountRouter = Router();
const accountController = new AccountController();

const prefix = "/account";

accountRouter.post(
  `${prefix}/register`,
  validateDto(AccountCreateDto),
  (req, res) => accountController.createAccount(req, res)
);
accountRouter.post(`${prefix}/login`, (req, res) =>
  accountController.login(req, res)
);
accountRouter.get(`${prefix}/details`, authMiddleware, (req, res) =>
  accountController.getAccountDetails(req, res)
);

export default accountRouter;
