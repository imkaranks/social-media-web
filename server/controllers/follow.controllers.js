import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import handleAsyncError from "../utils/handleAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const follow = handleAsyncError(async (req, res) => {
  const { userId } = req.params;

  if (!userId.trim()) {
    throw new ApiError(400, "userId must be provided");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const alreadyFollowing = await Follow.findOne({
    follower: req.user._id,
    following: user._id,
  });

  if (alreadyFollowing) {
    throw new ApiError(400, "already following the user");
  }

  const follow = await Follow.create({
    follower: req.user._id,
    following: user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, follow, "Followed user successfully"));
});

export const unfollow = handleAsyncError(async (req, res) => {
  const { userId } = req.params;

  if (!userId.trim()) {
    throw new ApiError(400, "userId must be provided");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const follow = await Follow.findOneAndDelete({
    follower: req.user._id,
    following: user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, follow, "Followed user successfully"));
});
