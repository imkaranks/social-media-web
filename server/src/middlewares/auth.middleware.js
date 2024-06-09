import jwt from "jsonwebtoken";
import catchAsyncError from "../utils/catchAsyncError.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const isAuthenticated = catchAsyncError(async (req, _, next) => {
  try {
    const cookies = req?.cookies;
    const incomingAccessToken =
      cookies?.accessToken ||
      (req.headers["authorization"] || req.headers["Authorization"])?.split(
        " "
      )[1];

    if (!incomingAccessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decoded = jwt.verify(
      incomingAccessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
