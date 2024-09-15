import User from "../models/user.model.js";
import SavedPost from "../models/savedPost.model.js";
import handleAsyncError from "../utils/handleAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const savePost = handleAsyncError(async (req, res) => {
  const { userId, postId } = req.params;

  if ([userId, postId].some((field) => !field || !field?.trim())) {
    throw new ApiError(400, "User id and post id are required");
  }

  const existingSavedPost = await SavedPost.findOne({
    user: userId,
    post: postId,
  });
  if (existingSavedPost) {
    throw new ApiError(400, "Post already saved");
  }

  const savedPost = await SavedPost.create({
    user: userId,
    post: postId,
  });
  if (!savedPost) {
    throw new ApiError(400, "Failed to save post");
  }

  res
    .status(201)
    .json(new ApiResponse(201, savedPost, "Saved post successfully"));
});

export const getSavedPost = handleAsyncError(async (req, res) => {
  const { userId } = req.params;

  if (!userId || !userId?.trim()) {
    throw new ApiError(400, "User id is required");
  }

  const posts = await SavedPost.find({ user: userId });

  res
    .status(201)
    .json(new ApiResponse(201, posts || [], "Saved post successfully"));
});

export const deleteSavedPost = handleAsyncError(async (req, res) => {
  const { savedPostId } = req.params;

  if (!savedPostId || !savedPostId?.trim()) {
    throw new ApiError(400, "Saved post id is required");
  }

  const savedPost = await SavedPost.findByIdAndDelete(savedPostId);

  res
    .status(201)
    .json(new ApiResponse(201, savedPost || [], "Saved post successfully"));
});
