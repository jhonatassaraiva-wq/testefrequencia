import { PrismaClient } from "@prisma/client";

declare global {
  // prevent multiple instances during hot reload in dev
  // eslint-disable-next-line no-var
  var __prisma?: PrismaClient;
}
export const prisma =
  global.__prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  global.__prisma = prisma;
}
