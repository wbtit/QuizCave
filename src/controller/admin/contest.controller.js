import { ApiError } from "../../util/ApiError.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { AsyncHandler } from "../../util/AsyncHandler.js";
import { Contest } from "../../model/Contest.model.js";
import path from "path";

export const CreateContest = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized Access");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(401, "Unauthorized Access");
        }

        const {
            name, duration, rules, startDate, endDate, active, set
        } = req.body;

        if (!name || !duration || !rules || !startDate || !endDate || !set) {
            throw new ApiError(400, "All fields are required");
        }

        console.log(req.body)

        const newContest = await Contest.create({
            name: name.trim(),
            duration: Number(duration),
            rules: rules,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            createdBy: req.user._id,
            active: active ? active : false,
            set: set.trim().toUpperCase()
        })

        if (!newContest) {
            throw new ApiError(500, "Failed to create contest");
        }

        return res.status(201).json(new ApiResponse(201, newContest, "Contest created successfully"));
    } catch (error) {
        console.log(error)
        throw new ApiError(400, error.message);
    }
});

export const RemoveContest = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized Access");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(401, "Unauthorized Access");
        }

        const contest = await Contest.findByIdAndDelete(req.params.id);

        if (!contest) {
            throw new ApiError(404, "Contest not found");
        }

        return res.status(200).json(new ApiResponse(200, contest, "Contest removed successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export const GetContest = AsyncHandler(async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            throw new ApiError(404, "Contest not found");
        }

        return res.status(200).json(new ApiResponse(200, contest, "Contest details"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export const GetContests = AsyncHandler(async (req, res) => {
    try {
        const query = {};
        if ("active" in req.query) {
            query.active = req.query.active;
        }
        const contests = await Contest.find(query);

        if (!contests) {
            throw new ApiError(404, "No contests found");
        }

        return res.status(200).json(new ApiResponse(200, contests, "All contests"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});