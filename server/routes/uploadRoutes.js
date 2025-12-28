import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Setare storage Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // toate imaginile se salvează în server/uploads
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Ruta POST upload imagine
router.post("/", upload.single("image"), (req, res) => {
  res.send({ imageUrl: `/uploads/${req.file.filename}` });
});

export default router;
