import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import {
    CreateContest, GetContest, GetContests, RemoveContest,UpdateContest
} from "../../controller/admin/contest.controller.js";

export const AdminContestRouter = Router();

AdminContestRouter.get("/all", auth, GetContests);
AdminContestRouter.get("/:id", auth, GetContest);
AdminContestRouter.post("/create", auth, CreateContest);
AdminContestRouter.delete("/remove/:id", auth, RemoveContest);
AdminContestRouter.put("/update/:id", auth, UpdateContest);