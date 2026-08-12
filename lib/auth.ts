import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token?: string) {
  if (!token) return null;
  try {
    const data = jwt.verify(token, JWT_SECRET) as any;
    return data;
  } catch {
    return null;
  }
}

export async function getUserFromReq(req: any) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const token = auth.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user;
}
