// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env/setup-envs";
import { UserPayload } from "../../@types/user";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const jwtPublicKey = env.JWT_PUBLIC_KEY;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtPublicKey, {
      algorithms: ["RS256"],
    }) as UserPayload;

    if (!decoded.email || !decoded.id) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
    return;
  }
};
