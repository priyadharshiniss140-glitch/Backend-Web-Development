import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    const uniqueName = `avatar-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}${extension}`;
    callback(null, uniqueName);
  },
});

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function fileFilter(req, file, callback) {
  if (allowedMimeTypes.has(file.mimetype)) {
    return callback(null, true);
  }
  return callback(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed."));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
