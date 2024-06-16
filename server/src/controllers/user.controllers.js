import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Follow from "../models/follow.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

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

export const changeAvatar = catchAsyncError(async (req, res) => {});

export const updateUser = catchAsyncError(async (req, res) => {});

export const deleteUser = catchAsyncError(async (req, res) => {});

export const changePassword = catchAsyncError(async (req, res) => {});
