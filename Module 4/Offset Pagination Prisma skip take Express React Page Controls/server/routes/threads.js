import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();
const pageSize = 10;

router.get("/", async (req, res, next) => {
  try {
    const requestedPage = Number(req.query.page);
    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [threads, total] = await Promise.all([
      prisma.thread.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.thread.count(),
    ]);

    const hasMore = total > page * pageSize;
    res.json({ threads, total, hasMore });
  } catch (error) {
    next(error);
  }
});

export default router;
