import { ApiError } from "../../util/ApiError.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { AsyncHandler } from "../../util/AsyncHandler.js";
import { Question } from "../../model/Question.model.js";
import { writeFile } from "fs/promises";
import path from "path";

export const createQuestion = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(403, "Forbidden");
        }

        const { set, difficult, question, type } = req.body;

        console.log(req.body);

        if (!set || !difficult || !question || !type) {
            throw new ApiError(400, "All fields are required");
        }


        const data = {
            set: set.trim().toUpperCase(),
            difficult: difficult.trim().toLowerCase(),
            question: question.trim(),
            type: type.trim().toLowerCase(),
        };

        if (req?.body?.questionImage) {
            const { questionImage } = req.body;

            if (questionImage) {
                const base64Data = questionImage.replace(/^data:image\/jpeg;base64,/, "");
                const imageName = Date.now() + ".jpg";
                const imagePath = path.join("uploads", imageName);
                const savePath = path.join("home", "quizcave", "wbt-quizcave", "public")

                writeFile(savePath, base64Data, "base64", function (err) {
                    if (err) {
                        throw new ApiError(500, "Failed to store image");
                    }
                });

                data.questionImage = imagePath;
            }
        }
        // data.questionImage = path.join("uploads", path.basename(req?.files?.questionImage[0]?.path));

        if (type === "mcq") {
            const { mcqOptions, answer } = req.body;

            if (!mcqOptions || !answer) {
                throw new ApiError(400, "All fields are required");
            }

            data.mcqOptions = mcqOptions;
            data.answer = answer;
        } else if (type === "multiple") {
            const { multipleQuestion, multipleAnswer } = req.body;

            if (!multipleQuestion || !multipleAnswer) {
                throw new ApiError(400, "All fields are required");
            }

            data.multipleQuestion = multipleQuestion;
            data.multipleAnswer = multipleAnswer;
        } else {
            const { answer } = req.body;

            if (!answer) {
                throw new ApiError(400, "All fields are required");
            }

            data.answer = answer;
        }

        const newQuestion = await Question.create(data);

        if (!newQuestion) {
            throw new ApiError(400, "Failed to create question");
        }

        return res.status(201).json(new ApiResponse(201, newQuestion, "Successfully added question"));
    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message);
    }
});

export const getQuestions = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const page = parseInt(req?.query?.p) || 0;
        const limit = parseInt(req?.query?.l) || 100;

        const data = {};

        if (req?.query?.set) {
            data.set = req?.query?.set;
        }

        if (req?.query?.difficult) {
            data.difficult = req?.query?.difficult;
        }

        if (req?.query?.type) {
            data.type = req?.query?.type;
        }

        if (req.user.role !== "admin") {
            throw new ApiError(403, "Forbidden");
        }

        const questions = await Question.find(data)
            .limit(limit).skip(page * limit).sort({ createdAt: -1 });

        if (!questions) {
            throw new ApiError(404, "No questions found");
        }

        return res.status(200).json(new ApiResponse(200, questions));
    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message);
    }
});

export const getQuestion = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(403, "Forbidden");
        }

        const question = await Question.findById(req.params.id);

        if (!question) {
            throw new ApiError(404, "Question not found");
        }

        return res.status(200).json(new ApiResponse(200, question));
    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message);
    }
});

export const removeQuestion = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (req?.user?.role !== "admin") {
            throw new ApiError(403, "Forbidden");
        }

        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {
            throw new ApiError(404, "Question not found");
        }

        return res.status(200).json(new ApiResponse(200, question, "Question deleted successfully"));
    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message);
    }
});

export const updateQuestion = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(403, "Forbidden");
        }

        const questionInfo = await Question.findById(req.params.id);

        if (!questionInfo) {
            throw new ApiError(404, "Question not found");
        }

        const { set, difficult, question } = req.body;

        if (!set || !difficult || !question) {
            throw new ApiError(400, "All fields are required");
        }

        const questionImage = req?.files?.questionImage ? req.files.questionImage[0].filename : "";

        const data = {
            set: set.trim().toUpperCase(),
            difficult: difficult.trim().toLowerCase(),
            question: question.trim(),
        };

        if (questionImage.trim() !== "") {
            data.questionImage = path.join("uploads", path.basename(req?.files?.questionImage[0]?.path));
        }

        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, data, { new: true });

        if (!updatedQuestion) {
            throw new ApiError(400, "Failed to update question");
        }

        return res.status(200).json(new ApiResponse(200, updatedQuestion, "Question updated successfully"));

    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message);
    }
});