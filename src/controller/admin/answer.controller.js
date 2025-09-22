import { ApiError } from "../../util/ApiError.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { AsyncHandler } from "../../util/AsyncHandler.js";
import { Contest } from "../../model/Contest.model.js";
import { Result } from "../../model/Answer.model.js";
import { User } from "../../model/User.model.js";
import { sendDeclaredResult } from "../mail.controller.js";
import { Question } from "../../model/Question.model.js";

export const GetAllContest = AsyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access");
    }
    if (!req.user.type === "admin") {
      throw new ApiError(403, "Access Forbidden");
    }

    const data = {};

    if ("active" in req.query) {
      data.active = req.query.active;
    }

    if (req?.query?.past === "true") {
      data.endDate = { $lt: new Date() };
    }

    const contests = await Contest.find({ ...data }).select(
      "-rules -createdAt -updatedAt -duration"
    );

    if (!contests) {
      throw new ApiError(404, "No Contests Found");
    }

    const results = contests.map(async (contest) => {
      const temp = await Result.countDocuments({
        contestId: contest._id,
        declared: false,
      });
      return { ...contest.toObject(), unEvaluated: temp };
    });

    for (let i = 0; i < results.length; i++) {
      results[i] = await results[i];
    }

    return res.json(new ApiResponse(200, results, "All Contests Listed"));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, err.message);
  }
});

export const GetResultsForContest = AsyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access");
    }
    if (!req.user.type === "admin") {
      throw new ApiError(403, "Access Forbidden");
    }

    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      throw new ApiError(404, "Contest Not Found");
    }

    const results = await Result.find({
      contestId: contest._id,
      declared: true,
    }).populate("userId").populate({path:'answers.questionId',model:'Question'}).sort({ totalMarks: -1, sumbittedOn: 1});

    if (!results) {
      throw new ApiError(404, "No Results Found");
    }

    return res.json(new ApiResponse(200, results, "Results Listed"));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, err.message);
  }
});

export const DeclareResultForContest = AsyncHandler(async (req, res) => {
  try {
    // Authorization
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access");
    }

    if (req.user.role !== "admin") {
      console.log("USER:",req.user.type)
      throw new ApiError(403, "Access Forbidden");
    }

    // Fetch Contest
    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      throw new ApiError(404, "Contest Not Found");
    }

    if (!contest.active) {
      throw new ApiError(400, "Contest Not Active");
    }

    if (new Date(contest.endDate) > new Date()) {
      throw new ApiError(400, "Contest Not Ended Yet");
    }

    // Fetch Undeclared Results
    console.log("CONTENT ID:",contest._id);
    
    const results = await Result.find({
      contestId: contest._id,
      declared: false,
    });

    if (!results || results.length === 0) {
      console.log("RESULTS:",results);
      
      throw new ApiError(404, "No Results Found");
    }

    const markingSchema = {
      easy: 1,
      medium: 3,
      hard: 5,
    };

    for (const result of results) {
      let total = 0;

      for (const answer of result.answers) {
        const question = await Question.findById(answer.questionId);

        if (!question) {
          console.warn(`Skipping answer: Question not found (ID: ${answer.questionId})`);
          continue;
        }

        const difficultyMark = markingSchema[question.difficult] || 0;

        if (question.type === "multiple") {
          let isCorrect = true;

          question.multipleAnswer.forEach((correctAns, index) => {
            if (
              correctAns?.toLowerCase() !==
              (answer.answer?.[index]?.toLowerCase() || "")
            ) {
              isCorrect = false;
            }
          });

          if (isCorrect) {
            total += difficultyMark;
          }

        } else {
          if (
            question.answer?.toLowerCase() ===
            answer.answer?.[0]?.toLowerCase()
          ) {
            total += difficultyMark;
          }
        }

        // Store marks per answer (if needed for frontend/debug)
        answer.marks = difficultyMark;
      }

      result.totalMarks = total;
      result.declared = true;
      await result.save();
    }

    // Update contest status
    contest.declared = true;
    await contest.save();

    return res.json(new ApiResponse(200, {}, "Results Declared"));
  } catch (err) {
    console.error("Error declaring results:", err);
    throw new ApiError(500, err.message || "Internal Server Error");
  }
});


export const SendResult = AsyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access");
    }

    const {resultList} = req.body;

    for (const result of resultList) {
      const reslt = await Result.findById(result).populate("userId").populate("contestId");

      if (reslt.selected) {
        continue;
      } else {
        reslt.selected = true;
        await reslt.save();
      }

      await sendDeclaredResult(reslt?.userId?.email, reslt?.userId?.name, reslt.sumbittedOn);
    }

    return res.json(new ApiResponse(200, {}, "Result Sent"));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, err.message);
  }
})
