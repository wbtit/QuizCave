import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    answer: {
        type: [String],
        required: true
    },
    marks: {
        type: Number
    }
});

const ResultSchema = new mongoose.Schema({
    contestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: {
        type: [AnswerSchema]
    },
    totalMarks: {
        type: Number
    },
    sumbittedOn: {
        type: Date
    },
    timeTaken: {
        type: Number
    },
    declared: {
        type: Boolean,
        default: false
    },
    result: {
        type: String
    },
    selected: {
        type: Boolean
    }
});

export const Result = mongoose.model('Result', ResultSchema);