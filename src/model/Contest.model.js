import mongoose from "mongoose";


const ContestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    rules: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    registration: {
        type: Boolean,
        default: true
    },
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    declared: {
        type: Boolean,
        default: false
    },
    set: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D', 'E']
    }
}, {
    timestamps: true
});

export const Contest = mongoose.model('Contest', ContestSchema);