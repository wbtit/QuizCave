import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import {
    createQuestion, getQuestions, getQuestion, updateQuestion, removeQuestion
} from "../../controller/admin/question.controller.js";

export const AdminQuestionRouter = Router();

AdminQuestionRouter.get("/all", auth, getQuestions);
AdminQuestionRouter.get("/:id", auth, getQuestion);
AdminQuestionRouter.post("/create", auth, upload.fields([
    { name: "questionImage", maxCount: 1 },
]), createQuestion);
AdminQuestionRouter.put("/update/:id", auth, upload.fields([
    { name: "questionImage", maxCount: 1 },
]), updateQuestion);
AdminQuestionRouter.delete("/remove/:id", auth, removeQuestion);