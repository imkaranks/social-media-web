import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Follow from "../models/follow.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import upload from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

export const getUsers = catchAsyncError(async (req, res) => {
  const users = await User.find({}).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, users || [], "Users fetch successfully"));
});

export const getUserById = catchAsyncError(async (req, res) => {
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

export const getUserByUsername = catchAsyncError(async (req, res) => {
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

export const searchUsers = catchAsyncError(async (req, res) => {
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

export const changeAvatar = catchAsyncError(async (req, res) => {
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

export const updateUser = catchAsyncError(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(
      401,
      "You must be authenticated to perform this action."
    );
  }
  const { userId } = req.params;
  const { fullname, username, bio } = req.body;
  // const { avatar, banner } = req.files;

  // if (
  //   [fullname, username, bio].some((field) => !field || field.trim() === "")
  // ) {
  //   throw new ApiError(
  //     400,
  //     "Please provide valid values for fullname, username, and bio."
  //   );
  // }

  // const updatedFields = {
  //   fullname,
  //   username,
  //   bio,
  // };
  // if (avatar) {
  //   updatedFields.avatar = avatar;
  // }
  // if (banner) {
  //   updatedFields.banner = banner;
  // }

  // const user = await User.findByIdAndUpdate(userId, updatedFields, {
  //   new: true,
  // });

  // if (!user) {
  //   throw new ApiError(404, "User not found");
  // }

  res.status(200).json(new ApiResponse(200, {}));
});

export const updateUserLastSeen = catchAsyncError(async (req, res) => {
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

export const changeEmail = catchAsyncError(async (req, res) => {});

export const forgotPassword = catchAsyncError(async (req, res) => {});

export const changePassword = catchAsyncError(async (req, res) => {});
