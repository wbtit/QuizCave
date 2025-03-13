import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { 
    GetAllContests, GetContestById, AttemptContest
} from "../controller/contest.controller.js";

export const ContestRouter = Router();

ContestRouter.get("/all", auth, GetAllContests);
ContestRouter.get("/:id", auth, GetContestById);
ContestRouter.post("/attempt/:id", auth, AttemptContest);