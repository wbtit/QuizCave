import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const uploadDir = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "public", "uploads");

const ensureUploadDir = () => {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true, mode: 0o775 });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            ensureUploadDir();
            cb(null, uploadDir);
        } catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4().toString()}.${file.originalname.split('.').pop()}`);
    },
});

export const upload = multer({ storage: storage });
