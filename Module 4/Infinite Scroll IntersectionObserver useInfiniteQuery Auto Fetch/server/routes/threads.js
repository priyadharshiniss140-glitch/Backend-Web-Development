import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// Cursor-based pagination (already wired — do NOT change this file).
// GET /api/threads?take=10          → first page
// GET /api/threads?take=10&cursor=5 → the page after thread id 5
router.get("/", async (req, res, next) => {
  try {
    const take = Number(req.query.take) || 10;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

    const threads = await prisma.thread.findMany({
      take,
      skip: cursor ? 1 : 0, // step past the anchor row so it isn't repeated
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: "asc" }, // stable, unique order for the cursor to walk
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
    });

    const lastThread = threads[threads.length - 1];
    const nextCursor = lastThread?.id ?? null; // null = no more pages

    res.json({ threads, nextCursor });
  } catch (error) {
    next(error);
  }
});

export default router;
