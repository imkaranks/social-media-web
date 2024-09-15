import User from "../models/user.model.js";
import ApiError from "./ApiError.js";

const generateAuthTokens = async (userId, res) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.getAccessToken();
    const refreshToken = await user.getRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    // Set options for cookies
    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000, // 1 days
      secure: process.env.NODE_ENV === "production", // Secure flag only for production
      httpOnly: true, // Prevent XSS attacks
      sameSite: "strict", // Prevent CSRF attacks
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating tokens: ",
      error
    );
  }
};

export default generateAuthTokens;
