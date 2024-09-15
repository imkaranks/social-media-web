import User from "../models/user.model.js";
import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import handleAsyncError from "../utils/handleAsyncError.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getLikes = handleAsyncError(async (req, res) => {
  const { user, username, post } = req.query;
  const query = {};

  if (user?.trim() || username?.trim()) {
    const existingUser = await User.findOne({
      $or: [{ _id: user }, { username }],
    });

    if (!existingUser) {
      throw new ApiError(404, "No user found with provided field");
    }

    query.user = existingUser._id;
  }
  if (post?.trim()) {
    query.post = post;
  }

  const likes = await Like.find(query)
    .populate({
      path: "user",
      select: "username fullname avatar",
    })
    .populate({ path: "post", select: "title content author" })
    .populate({ path: "comment", select: "content user" });

  // const usersWhoLiked = likes.map((like) => like.user);

  res
    .status(200)
    .json(new ApiResponse(200, likes || [], "Successfully get likes"));
});

export const toggleLike = handleAsyncError(async (req, res) => {
  const { type, id } = req.body;

  if ([type, id].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please provide both type and id");
  }

  let Model;
  let field;

  if (type.toLowerCase() === "post") {
    Model = Post;
    field = "post";
  } else if (type.toLowerCase() === "comment") {
    Model = Comment;
    field = "comment";
  } else {
    throw new ApiError(400, "Invalid target type");
  }

  const target = await Model.findById(id);

  if (!target) {
    throw new ApiError(404, `${type} not found`);
  }

  const existingLike = await Like.findOne({
    [field]: target._id,
    user: req.user._id,
  });

  if (existingLike) {
    await Model.findByIdAndUpdate(target._id, {
      $pull: { likes: req.user._id },
    });

    await Like.findByIdAndDelete(existingLike._id);

    res
      .status(200)
      .json(new ApiResponse(200, existingLike, "Like removed successfully"));
  } else {
    const like = await Like.create({
      user: req.user._id,
      [field]: target._id,
    });

    target.likes.push(req.user._id);
    await target.save();

    res.status(201).json(new ApiResponse(201, like, "Like added successfully"));
  }
});
