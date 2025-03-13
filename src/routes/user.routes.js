import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
    RegisterStudent, LoginUser, GetUser
 } from "../controller/user.controller.js"

export const UserRouter = Router();

UserRouter.post("/register", upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "resume", maxCount: 1},
    { name: "marksheet", maxCount: 10}
]), RegisterStudent);

UserRouter.post("/login", LoginUser);

UserRouter.get("/", auth, GetUser);