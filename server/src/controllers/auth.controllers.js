import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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

export const signup = catchAsyncError(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    fullname,
    username,
    email,
    password,
    avatar: `https://robohash.org/${username}`,
  });

  // Generate authentication token and set cookie
  const { accessToken } = await generateAuthTokens(user._id, res);

  const createdUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  if (!createdUser) throw new ApiError(500);

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, accessToken },
        "User registered successfully"
      )
    );
});

export const signin = catchAsyncError(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Validate user's password
  const isValidPassword = await user.didPasswordMatch(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate authentication token and set cookie
  const { accessToken } = await generateAuthTokens(user._id, res);

  const authenticatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: authenticatedUser, accessToken },
        "User logged in successfully"
      )
    );
});

export const signout = catchAsyncError(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401);
  }

  await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  // Set options for cookies
  const cookieOptions = {
    maxAge: 0, // Set to expire immediately
    secure: process.env.NODE_ENV === "production", // Secure flag only for production
    httpOnly: true, // Prevent XSS attacks
    sameSite: "strict", // Prevent CSRF attacks
  };

  // Clear JWT cookie on logout
  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);

  return res.status(200).json(new ApiResponse(200, {}, "User logged out"));
});

export const refreshAccessToken = catchAsyncError(async (req, res) => {
  const cookies = req.cookies;
  const incomingRefreshToken = cookies?.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id);

  if (!user) throw new ApiError(404, "User not found");

  if (incomingRefreshToken !== user?.refreshToken)
    throw new ApiError(403, "Refresh token mismatch");

  const { accessToken } = await generateAuthTokens(user._id, res);

  const authenticatedUser = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: authenticatedUser, accessToken },
        "Access token refreshed"
      )
    );
});
