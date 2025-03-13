import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import {
    GetAllContest,
    GetResultsForContest,
    DeclareResultForContest,
    SendResult
} from "../../controller/admin/answer.controller.js";

export const AdminResultRouter = Router();

AdminResultRouter.get("/all", auth, GetAllContest);
AdminResultRouter.get("/results/:id", auth, GetResultsForContest);
AdminResultRouter.get("/:id/declare", auth, DeclareResultForContest);
AdminResultRouter.post("/send", auth, SendResult);