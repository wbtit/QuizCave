import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    set: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D', 'E']
    },
    difficult: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard']
    },
    question: {
        type: String,
        required: true
    },
    questionImage: {
        type: String
    },
    type: {
        type: String,
        required: true,
        enum: ['mcq', 'short', 'long', 'numerical', 'multiple']
    },
    mcqOptions: {
        type: [String]
    },
    answer: {
        type: String
    },
    multipleQuestion: {
        type: [String]
    },
    multipleAnswer: {
        type: [String]
    }
}, {
    timestamps: true
});

export const Question = mongoose.model('Question', QuestionSchema);