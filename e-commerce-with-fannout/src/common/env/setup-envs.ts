import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  RABBITMQ_PROTOCOL: z.string(),
  RABBITMQ_HOST: z.string(),
  RABBITMQ_PORT: z.coerce.number().default(5672),
  RABBITMQ_USERNAME: z.string(),
  RABBITMQ_PASSWORD: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error(" Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
