import { ApiError } from "../util/ApiError.js"
import { ApiResponse } from "../util/ApiResponse.js"
import { AsyncHandler } from "../util/AsyncHandler.js"
import { User } from "../model/User.model.js"
import jwt from "jsonwebtoken";

export const auth = AsyncHandler(async (req, res, next) => {
    try{
        //console.log(req);
        //console.log(req.headers);
        const token = req?.headers?.authorization?.replace("Bearer ", "") || req?.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401, "Unauthorized Access");
        }

        const decoded = jwt.verify(token, 'b4c537878c67a487532e85ad5210a1d3836c02d267c359d396bb4d6abadeaf2f');
        
        const user = await User.findById(decoded._id).select("-password -refreshToken -accessToken -__v");

        if (!user) {
            throw new ApiError(401, "Invalid Token Received");
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(`AUTH ERROR: Error during Authentication: ${error}`);
        throw new ApiError(401, "Unable to authenticate");
    }
});
