import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

function imageFileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (/^image\//.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ được upload file ảnh!"));
  }
}

export const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file 5MB
});

export default upload;
