import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { getUserFromReq } from "../../lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "unauthenticated" });

  if (req.method === "POST") {
    const { type, lat, lon, note } = req.body;
    if (!type || !["IN", "OUT", "BREAK_START", "BREAK_END"].includes(type)) {
      return res.status(400).json({ error: "invalid type" });
    }
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || null;
    const punch = await prisma.punch.create({
      data: {
        userId: user.id,
        type,
        lat: lat ?? undefined,
        lon: lon ?? undefined,
        note,
        recordedBy: "web",
        ip: ip ?? undefined
      }
    });
    return res.status(201).json(punch);
  }

  if (req.method === "GET") {
    // admins could pass ?userId=<id>; for now only the user can see own punches
    const { from, to, userId } = req.query;
    const where: any = {};
    // allow admin to pass userId (simple role check)
    if (user.roleId) {
      const role = await prisma.role.findUnique({ where: { id: user.roleId } });
      if (role && role.name === "admin" && typeof userId === "string") {
        where.userId = userId;
      } else {
        where.userId = user.id;
      }
    } else {
      where.userId = user.id;
    }
    if (from) where.ts = { gte: new Date(String(from)) };
    if (to) where.ts = where.ts ? { ...where.ts, lt: new Date(String(to)) } : { lt: new Date(String(to)) };

    const punches = await prisma.punch.findMany({
      where,
      orderBy: { ts: "desc" },
      take: 200
    });
    return res.json(punches);
  }

  return res.status(405).end();
}
