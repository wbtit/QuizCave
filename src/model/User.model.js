import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AddressSchema = new mongoose.Schema({
    streetLine1: {
        type: String,
        required: true,
    },
    streetLine2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    }
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    altPhone: {
        type: String,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "student"]
    },
    profilePic: {
        type: String,
    },
    designation: {
        type: String,
    },
    dob: {
        type: Date
    },
    studentId: {
        type: String,
    },
    passingYear: {
        type: Number,
    },
    currAddress: {
        type: AddressSchema
    },
    permAddress: {
        type: AddressSchema
    },
    gender: {
        type: String,
        enum: ["male", "female", "other", "prefer not to say"]
    },
    fatherName: {
        type: String,
    },
    motherName: {
        type: String,
    },
    currentSemester: {
        type: Number,
    },
    branch: {
        type: String,
    },
    course: {
        type: String,
    },
    college: {
        type: String,
    },
    cgpa: {
        type: Number,
    },
    backlog: {
        type: Number,
    },
    resume: {
        type: String,
    },
    marksheet: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hashSync(this.password, 10);
    }
    next();
});

UserSchema.methods.verifyPassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = async function() {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userId: this.userId
        },
        'b4c537878c67a487532e85ad5210a1d3836c02d267c359d396bb4d6abadeaf2f',
        {
            expiresIn: '7d'
        }
    )
}


UserSchema.methods.generateRefreshToken = async function() {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userId: this.userId
        },
        '2574766afd105a34115e144f0d357681c4daff9d26a129092b3b489cfe5b460b',
        {
            expiresIn: '30d'
        }
    )
}

export const User = mongoose.model("User", UserSchema);
