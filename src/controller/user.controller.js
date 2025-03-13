import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { AsyncHandler } from "../util/AsyncHandler.js";
import { User } from "../model/User.model.js"
import { generateToken } from "../util/TokenGeneration.js";
import path from "path";
import { sendRegistrationMail } from "./mail.controller.js";

export const RegisterStudent = AsyncHandler(async (req, res) => {
    try {

        console.log(req.body);
        const {
            name, email, phone, password, dob, studentId,
            currAddress, permAddress, gender,
            fatherName, motherName, currentSemester, branch,
            course, college, cgpa, backlog, passingYear, altPhone
        } = req.body;

        if (!name || !email || !phone || !password || !dob || !studentId ||
            !currAddress || !permAddress || !gender || !fatherName || !motherName ||
            !currentSemester || !branch || !course || !college || !cgpa || !backlog || !passingYear) {
            throw new ApiError(400, "All fields are required");
        }

        if (!req?.files?.profile || !req?.files?.resume || !req?.files?.marksheet) {
            throw new ApiError(400, "Profile Picture, Resume and Marksheets are required");
        }

        const profile = path.join('uploads', path.basename(req?.files?.profile[0]?.path));
        const resume = path.join('uploads', path.basename(req?.files?.resume[0]?.path));
        const marksheet = Array.from(req?.files?.marksheet).map(file => path.join('uploads', path.basename(file?.path)));

        const existingUser = await User.findOne({$or: [
            {email}, {phone}, {studentId}
        ]});

        if (existingUser) {
            throw new ApiError(400, "User already exists");
        }

        const currentAddress = JSON.parse(currAddress);
        const permanentAddress = JSON.parse(permAddress);

        const newUser = await User.create({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password: password.trim(),
            userId: `WBT-${studentId.trim()}`,
            role: "student",
            passingYear: Number(passingYear.trim()),
            altPhone: altPhone ? altPhone.trim() : "",
            profilePic: profile ? profile.trim() : "",
            marksheet: marksheet,
            dob: dob.trim(),
            studentId: studentId.trim(),
            currAddress: {
                streetLine1: currentAddress.streetLine1.trim(),
                streetLine2: currentAddress?.streetLine2? currentAddress?.streetLine2.trim(): "",
                city: currentAddress.city.trim(),
                state: currentAddress.state.trim(),
                country: currentAddress.country.trim(),
                zip: currentAddress.zip.trim(),
            },
            permAddress: {
                streetLine1: permanentAddress.streetLine1.trim(),
                streetLine2: permanentAddress?.streetLine2? permanentAddress?.streetLine2.trim(): "",
                city: permanentAddress.city.trim(),
                state: permanentAddress.state.trim(),
                country: permanentAddress.country.trim(),
                zip: permanentAddress.zip.trim(),
            },
            gender: gender.trim(),
            fatherName: fatherName.trim(),
            motherName: motherName.trim(),
            currentSemester: Number(currentSemester),
            branch: branch.trim(),
            course: course.trim(),
            college: college.trim(),
            cgpa: Number(cgpa),
            backlog: Number(backlog),
            resume: resume ? resume.trim() : ""
        })

        if (!newUser) {
            throw new ApiError(400, "Failed to register user");
        }

        const { accessToken, refreshToken } = await generateToken(newUser._id);

        const newUserInfo = await User.findById(newUser._id).select("-password -_id -__v");


        const option = {
            httpOnly: true,
            secure: true,
        }

        try {
            await sendRegistrationMail(name.trim(), email.trim(), newUserInfo.userId, password.trim());
        } catch (error) {
            console.log(error);
        }

        return res.status(201)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(new ApiResponse(201, {
                ...newUserInfo,
                accessToken: accessToken,
                refreshToken: refreshToken,
            }, "User registered successfully"));
    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message);
    }
})

export const LoginUser = AsyncHandler(async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            throw new ApiError(400, "User ID and password are required");
        }

        const user = await User.findOne({ userId: userId.trim() }).select("-__v -accessToken -refreshToken");

        if (!user) {
            throw new ApiError(400, "User not found");
        }

        if (!user.verifyPassword(password)) {
            throw new ApiError(400, "Incorrect password");
        }

        const { accessToken, refreshToken } = await generateToken(user._id);

        const option = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(new ApiResponse(200, {
                name: user.name,
                email: user.email,
                phone: user.phone,
                userId: user.userId,
                role: user.role,
                profilePic: user.profilePic,
                studentId: user.studentId,
                accessToken: accessToken,
                refreshToken: refreshToken
            }, "User logged in successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
})

export const GetUser = AsyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-__v -accessToken -refreshToken -password");

        if (!user) {
            throw new ApiError(400, "User not found");
        }

        return res.status(200)
            .json(new ApiResponse(200, user, "User details fetched successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

