import { Router } from "express";
import upload from "../config/upload.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post(
  "/upload",
  verifyToken,
  upload.single("avatar"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: "No image file uploaded. Use the avatar field.",
      });
    }

    return res.status(201).json({
      url: `/uploads/${req.file.filename}`,
    });
  },
);

export default router;
