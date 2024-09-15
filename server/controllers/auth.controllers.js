import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import handleAsyncError from "../utils/handleAsyncError.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import VerificationToken from "../models/verificationToken.model.js";
import upload from "../utils/cloudinary.js";
import generateAuthTokens from "../utils/generateAuthTokens.js";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";

export const signup = handleAsyncError(async (req, res) => {
  const { fullname, username, email, password } = req.body;
  const file = req?.file;

  if (
    ![fullname, username, email, password].every(
      (field) => field && field.trim() !== ""
    )
  ) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(
      409,
      "Username or email is already registered. Please choose a different one."
    );
  }

  let result;

  if (file) {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    result = await upload(dataURI);
  }

  const user = await User.create({
    fullname,
    username,
    email,
    password,
    avatar: file
      ? { public_id: result.public_id, url: result.url }
      : { url: `https://robohash.org/${username}` },
  });

  if (!user) {
    throw new ApiError(
      500,
      "User registration failed. Please try again later."
    );
  }

  const token = crypto.randomBytes(20).toString("hex");

  const verificationToken = await VerificationToken.create({
    user: user._id,
    token,
  });

  if (!verificationToken) {
    throw new ApiError(500, "Failed to create verification token");
  }

  await sendVerificationEmail(user.email, token);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        "User registered successfully. Please check your email to verify your account."
      )
    );
});

export const verifyEmail = handleAsyncError(async (req, res) => {
  const { email, token } = req.params;

  if (!token?.trim()) {
    throw new ApiError(400, "Verification token is missing or invalid.");
  }

  if (!email?.trim()) {
    throw new ApiError(400, "Email is missing or invalid.");
  }

  const user = await User.findOne({ email }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(400, "No user found with this email");
  }

  if (user.isVerified) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email is already verified."));
  }

  const verificationToken = await VerificationToken.findOne({ token });

  if (
    !verificationToken ||
    verificationToken.createdAt < new Date(new Date() - 30 * 60 * 1000)
  ) {
    throw new ApiError(400, "Invalid or expired verification token.");
  }

  user.isVerified = true;
  await user.save();

  await VerificationToken.deleteOne({ token });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully."));
});

export const resendVerificationToken = handleAsyncError(async (req, res) => {
  const { email } = req.params;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "No user found with this email");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const existingToken = await VerificationToken.findOne({ user: user._id });

  if (existingToken) {
    await sendVerificationEmail(email, existingToken.token);

    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "Verification token resent successfully.")
      );
  }

  const token = crypto.randomBytes(20).toString("hex");

  await VerificationToken.create({
    user: user._id,
    token,
  });

  await sendVerificationEmail(email, token);

  return res
    .status(200)
    .json(
      new ApiResponse(201, {}, "New verification token sent successfully.")
    );
});

export const signin = handleAsyncError(async (req, res) => {
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

  const isValidPassword = await user.didPasswordMatch(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid user credentials");
  }

  if (!user.isVerified) {
    const existingToken = await VerificationToken.findOne({ user: user._id });

    if (existingToken) {
      await sendVerificationEmail(email, existingToken.token);
    } else {
      const token = crypto.randomBytes(20).toString("hex");

      await VerificationToken.create({
        user: user._id,
        token,
      });

      await sendVerificationEmail(email, token);
    }

    throw new ApiError(
      403,
      "Please verify your account. Check your email for the verification link."
    );
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

export const signout = handleAsyncError(async (req, res) => {
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

export const refreshAccessToken = handleAsyncError(async (req, res) => {
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
