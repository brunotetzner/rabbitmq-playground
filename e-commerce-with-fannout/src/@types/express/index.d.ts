import * as express from "express";
import { UserPayload } from "../user";

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}
