import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/home/quizcave/wbt-quizcave/public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4().toString()}.${file.originalname.split('.').pop()}`);
    },
});

export const upload = multer({ storage: storage });