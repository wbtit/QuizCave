import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { GetAllDeclaredResult, GetResultById,
    AddAnswerInResult, SumbitResult
} from "../controller/answer.controller.js";


export const ResultRouter = Router();

ResultRouter.get("/all", auth, GetAllDeclaredResult);
ResultRouter.get("/:id", auth, GetResultById);
ResultRouter.post("/add-answer/:id", auth, AddAnswerInResult);
ResultRouter.post("/submit/:id", auth, SumbitResult);