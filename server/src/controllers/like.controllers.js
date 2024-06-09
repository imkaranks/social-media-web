import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const toggleLike = catchAsyncError(async (req, res) => {
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
      // $pull: { likes: existingLike._id },
      $pull: { likes: req.user._id },
    });

    await Like.findByIdAndDelete(existingLike._id);

    res.status(200).json(new ApiResponse(200, existingLike, "Like removed"));
  } else {
    const like = await Like.create({
      user: req.user._id,
      [field]: target._id,
    });
    // target.likes.push(like._id);
    target.likes.push(req.user._id);
    await target.save();

    res.status(201).json(new ApiResponse(201, like, "Like added"));
  }
});
