import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import User from "../models/user.model.js";
import VerificationToken from "../models/verificationToken.model.js";
import handleAsyncError from "../utils/handleAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import upload from "../utils/cloudinary.js";

const RESET_TOKEN_EXPIRATION = 30 * 60 * 1000;

export const getUsers = handleAsyncError(async (req, res) => {
  const users = await User.find({}).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, users || [], "Users fetch successfully"));
});

export const getUser = handleAsyncError(async (req, res) => {
  const { username, fullname, email, id } = req.query;
  const query = {};

  if (username?.trim()) {
    query.username = username.trim();
  }
  if (fullname?.trim()) {
    query.fullname = fullname.trim();
  }
  if (email?.trim()) {
    query.email = email.trim();
  }
  if (id?.trim()) {
    query._id = id.trim();
  }

  const user = await User.findOne(query).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const getUserById = handleAsyncError(async (req, res) => {
  const { userId } = req.params;

  if (!userId.trim()) {
    throw new ApiError(400, "userId must be provided");
  }

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user || {}, "User fetched successfully"));
});

export const getUserByUsername = handleAsyncError(async (req, res) => {
  const { username } = req.params;

  if (!username.trim()) {
    throw new ApiError(400, "username must be provided");
  }

  const user = await User.findOne({ username }).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user || {}, "User fetched successfully"));
});

export const searchUsers = handleAsyncError(async (req, res) => {
  const { keyword } = req.query;

  if (!keyword.trim()) {
    throw new ApiError(400, "keyword must be provided");
  }

  const query = {
    $or: [
      { username: { $regex: keyword, $options: "i" } },
      { fullname: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
    ],
  };
  const users = await User.find(query).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, users || [], "Users fetched successfully"));
});

export const changeAvatar = handleAsyncError(async (req, res) => {
  const file = req?.file;
  const { userId } = req.params;

  if (!file) {
    throw new ApiError(400, "Avatar is required");
  }

  const b64 = Buffer.from(file.buffer).toString("base64");
  let dataURI = "data:" + file.mimetype + ";base64," + b64;
  const result = await upload(dataURI);

  const user = await User.findById(userId).select("-password -refreshToken");

  if (user?.avatar?.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  user.avatar = { public_id: result.public_id, url: result.url };

  await user.save();

  res.status(200).json(new ApiResponse(200, user, "Avatar changed"));
});

export const updateUser = handleAsyncError(async (req, res) => {
  if (!req?.user?._id) {
    throw new ApiError(
      401,
      "You must be authenticated to perform this action."
    );
  }

  const { userId } = req.params;
  const { fullname, username, bio } = req.body;
  const avatar = req?.files?.avatar;
  const banner = req?.files?.banner;

  if (userId !== String(req.user._id)) {
    throw new ApiError(403, "You are not permitted to change other's details");
  }

  if (
    [fullname, username, bio].some((field) => !field || field.trim() === "")
  ) {
    throw new ApiError(
      400,
      "Please provide valid values for fullname, username, and bio."
    );
  }

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const files = [];

  if (avatar) files.push(avatar);

  if (banner) files.push(banner);

  const results = await Promise.all(
    files.map(async (file) => {
      const b64 = Buffer.from(file[0].buffer).toString("base64");
      let dataURI = "data:" + file[0].mimetype + ";base64," + b64;
      const result = await upload(dataURI);
      return result;
    })
  );

  const updatedFields = {
    fullname,
    username,
    bio,
  };

  if (avatar) {
    if (user?.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    updatedFields.avatar = {
      url: results[0].url,
      public_id: results[0].public_id,
    };
  }
  if (banner) {
    if (user?.banner?.public_id) {
      await cloudinary.uploader.destroy(user.banner.public_id);
    }

    updatedFields.banner = {
      url: (results.length === 2 ? results[1] : results[0]).url,
      public_id: (results.length === 2 ? results[1] : results[0]).public_id,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, updatedFields, {
    new: true,
  }).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Updated user successfully"));
});

export const updateUserLastSeen = handleAsyncError(async (req, res) => {
  const userId = req.user._id;

  if (!userId.toString().trim()) {
    throw new ApiError(401, "Unauthorized Request");
  }

  const updateQuery = { lastSeen: Date.now() };

  await User.findByIdAndUpdate(userId, updateQuery);

  const response = new ApiResponse(
    200,
    updateQuery,
    "Last seen updated successfully"
  );
  res.status(response.status).json(response);
});

// export const changeEmail = handleAsyncError(async (req, res) => {});

export const forgotPassword = handleAsyncError(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email must be provided.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const token = crypto.randomBytes(20).toString("hex");

  const verificationToken = await VerificationToken.create({
    user: user._id,
    token,
    type: "RESET_PASSWORD",
  });

  // TODO: send the token to the user via email or other means

  res.status(200).json(new ApiResponse(200, {}, "Verification token sent."));
});

export const resetPassword = handleAsyncError(async (req, res) => {
  const { email, token, newPassword, confirmPassword } = req.body;

  if (
    !email?.trim() ||
    !token?.trim() ||
    !newPassword?.trim() ||
    !confirmPassword?.trim()
  ) {
    throw new ApiError(
      400,
      "Email, token, newPassword, and confirmPassword must be provided."
    );
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(
      400,
      "New password doesn't match with confirm password."
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const verificationToken = await VerificationToken.findOne({
    user: user._id,
    token,
    type: "RESET_PASSWORD",
  });

  if (
    !verificationToken ||
    verificationToken.createdAt < new Date(Date.now() - RESET_TOKEN_EXPIRATION)
  ) {
    throw new ApiError(400, "Invalid or expired verification token.");
  }

  user.password = newPassword;
  await user.save();

  await VerificationToken.findByIdAndDelete(verificationToken._id);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully."));
});

export const resendResetPasswordToken = handleAsyncError(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email must be provided.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const existingToken = await VerificationToken.findOne({
    user: user._id,
    type: "RESET_PASSWORD",
  });

  if (
    existingToken &&
    existingToken.createdAt >= new Date(Date.now() - RESET_TOKEN_EXPIRATION)
  ) {
    throw new ApiError(
      400,
      "A verification token was recently sent. Please wait before requesting a new one."
    );
  }

  const token = crypto.randomBytes(20).toString("hex");

  await VerificationToken.findByIdAndDelete(existingToken._id);

  const newToken = await VerificationToken.create({
    user: user._id,
    token,
    type: "RESET_PASSWORD",
  });

  // TODO: send the new token to the user via email or other means

  res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Reset password token resent successfully.")
    );
});

export const changePassword = handleAsyncError(async (req, res) => {
  if (!req?.user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  const { oldPassword, newPassword } = req.body;

  if (
    [oldPassword, newPassword].some((field) => !field || field.trim() === "")
  ) {
    throw new ApiError(400, "Both old and new password are required");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isValidPassword = await user.didPasswordMatch(oldPassword);
  if (!isValidPassword) {
    throw new ApiError(400, "Invalid password");
  }

  user.password = newPassword;

  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});
