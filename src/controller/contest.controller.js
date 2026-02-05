import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { AsyncHandler } from "../util/AsyncHandler.js";
import { Contest } from "../model/Contest.model.js";
import { Result } from "../model/Answer.model.js"
import { Question } from "../model/Question.model.js";

export const GetAllContests = AsyncHandler(async (req, res) => {
    try{
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const set = (req.user.course && ['BE/BTECH' ,'BCA', 'MTECH', 'DIPLOMA'].includes(req.user.course)) ? "A" : "B";

        const contests = await Contest.find({active: true, endDate: {$gt: new Date()}, declared: false, set: set})
            .select("-questions -registered -participants -createdBy -updatedAt -__v")
            .sort({startDate: -1});

        return res.json(new ApiResponse(200, contests, "Currently Available Contests Listed"));
    } catch(err) {
        console.log(err);
        throw new ApiError(500, err.message);
    }
});

export const GetContestById = AsyncHandler(async (req, res) => {
    try{
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const findcontest = await Contest.findById(req.params.id)
            .select("-createdBy -updatedAt -__v");

        if (!findcontest) {
            throw new ApiError(404, "Contest Not Found");
        }

        let contest 

        if (!(req.user._id in findcontest.participants)) {
            contest = await Contest.findById(req.params.id).select("-questions -participants -createdBy -updatedAt -__v");
        } else {
            contest = await Contest.findById(req.params.id).select("-createdBy -updatedAt -__v -participants");
        }

        return res.json(new ApiResponse(200, contest, "Contest Details"));
    } catch(err) {
        console.log(err);
        throw new ApiError(500, err.message);
    }
});

export const AttemptContest = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }


        const set = (req.user.course && ['BE/BTECH' ,'BCA', 'MTECH', 'DIPLOMA'].includes(req.user.course)) ? "A" : "B";

        const contest = await Contest.findOne({_id: req.params.id, active: true, set: set, endDate: {$gt: new Date()}});

        if (!contest) {
            throw new ApiError(404, "Contest Not Found");
        }

        if (!contest.active){
            throw new ApiError(400, "Contest Not Active");
        }

        if (contest.startDate > new Date()){
            throw new ApiError(400, "Contest Not Yet Started");
        }

        if (contest.endDate < new Date()){
            throw new ApiError(400, "Contest Has Ended");
        }

        const results = await Result.findOne({contestId: contest._id, userId: req.user._id});

        if (results || contest.participants.includes(req.user._id)) {
            throw new ApiError(400, "You Have Already Attempted This Contest");
        }

        const newResult = await Result.create({
            contestId: contest._id,
            userId: req.user._id
        });

        const fetchResult = await Result.findById(newResult._id).populate("userId");

        contest.participants.push(req.user._id);
        await contest.save();

        const questionsEasy = await Question.aggregate([
            { $match: { difficult: "easy", set:set } },
            { $sample: { size: 44 } },
            { $project: {
                _id : 1,
                difficult: 1,
                question: 1,
                questionImage: 1,
                type: 1,
                mcqOptions: 1,
                multipleQuestion: 1
              }
            }      
          ]);

        //console.log(questionsEasy)

        const questionsMedium = await Question.aggregate([
            { $match: { difficult: "medium", set:set } },
            { $sample: { size: 5 } },
            { $project: {
                _id : 1,
                difficult: 1,
                question: 1,
                questionImage: 1,
                type: 1,
                mcqOptions: 1,
                multipleQuestion: 1
              }
            }
          ]);

        const questionsHard = await Question.aggregate([
            { $match: { difficult: "hard", set:set } },
            { $sample: { size: 1 } },
            { $project: {
                _id : 1,
                difficult: 1,
                question: 1,
                questionImage: 1,
                type: 1,
                mcqOptions: 1,
                multipleQuestion: 1
              }
            }
          ]);

        const allQuestions = questionsEasy.concat(questionsMedium, questionsHard);

        return res.status(200).json(new ApiResponse(
            200, {
                contest: contest,
                questions: allQuestions,
                result: fetchResult
            }, "Contest Started Successfully"
        ))


    } catch(err) {
        console.log(err);
        throw new ApiError(500, err.message);
    }
});
