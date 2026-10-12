import { Router } from "express";
import upload from "../config/upload.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/upload", verifyToken, (req, res, next) => {
  upload.single("avatar")(req, res, (error) => {
    if (error) {
      if (error instanceof Error && error.message === "Only JPEG, PNG, WEBP, and GIF images are allowed.") {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof Error && error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File size must not exceed 5MB." });
      }
      return next(error);
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded. Use the avatar field." });
    }

    return res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

export default router;
