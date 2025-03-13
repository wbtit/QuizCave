import { Router } from "express";
import {
    RegisterUser, LoginUser, GetUserInfo,
    DeleteUser, UpdateUser
} from "../../controller/admin/user.controller.js"
import { auth } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";

export const AdminUserRouter = Router();

// GET Request
AdminUserRouter.get("/", auth, GetUserInfo);


AdminUserRouter.post("/login", LoginUser);
// AdminUserRouter.post("/register", auth, upload.fields([
AdminUserRouter.post("/register", upload.fields([
    { name: "profile", maxCount: 1 }
]), RegisterUser);
AdminUserRouter.put("/update", auth, upload.fields([
    { name: "profile", maxCount: 1 }
]), UpdateUser);
AdminUserRouter.delete("/delete", auth, DeleteUser);