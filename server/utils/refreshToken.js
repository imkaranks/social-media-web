import User from "../models/user.model.js";
import ApiError from "./ApiError.js";

const refreshToken = async (userId, res) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.getAccessToken();

    // Set options for cookies
    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000, // 1 days
      secure: process.env.NODE_ENV === "production", // Secure flag only for production
      // secure: true,
      httpOnly: true, // Prevent XSS attacks
      sameSite: "strict", // Prevent CSRF attacks
    };

    res.cookie("accessToken", accessToken, cookieOptions);

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token: ",
      error
    );
  }
};

export default refreshToken;
