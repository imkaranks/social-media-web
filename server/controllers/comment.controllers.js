import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import handleAsyncError from "../utils/handleAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Notification from "../models/notification.model.js";
import { getSocketId, io } from "../socket/socket.js";

const emitNotificationEvent = (userId, payload) => {
  const socketId = getSocketId(userId?.toString());
  if (!socketId) {
    console.error(`Socket ID not found for user ${userId}`);
  } else {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit("notification", payload);
    } else {
      console.error(`Socket not found for ID ${socketId}`);
    }
  }
};

export const createComment = handleAsyncError(async (req, res) => {
  const { postId } = req.params;
  const { content, parentId } = req.body;
  const user = req.user._id;

  if ([postId, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "postId and content must be provided");
  }

  const post = await Post.findById(postId);

  const comment = await Comment.create({
    user,
    post: post._id,
    content,
  });

  if (parentId) {
    const parentComment = await Comment.findById(parentId);

    if (!parentComment) {
      throw new ApiError(404, "No parent comment found with provided id");
    }

    comment.parent = parentComment._id;
    await comment.save();
    parentComment.children.unshift(comment._id);
    await parentComment.save();
    const notification = await Notification.create({
      user: parentComment.user,
      type: "REPLY",
      relatedComment: comment._id,
    });

    emitNotificationEvent(parentComment.user, notification);
  } else {
    if (!post) {
      throw new ApiError(404, "No post found with provided id");
    }

    post.comments.unshift(comment);
    await post.save();
    const notification = await Notification.create({
      user: post.author,
      type: "COMMENT",
      relatedComment: comment._id,
    });

    emitNotificationEvent(post.author, notification);
  }

  const createdComment = await Comment.findById(comment._id).populate({
    path: "user",
    select: "_id avatar username fullname",
  });

  res
    .status(201)
    .json(new ApiResponse(201, createdComment, "Comment added successfully"));
});

// Function to recursively populate children comments
async function populateChildren(comment) {
  await comment.populate({
    path: "children",
    populate: { path: "user", select: "_id avatar username fullname" },
    model: "Comment",
  });
  for (const child of comment.children) {
    await populateChildren(child);
  }
}

export const getComments = handleAsyncError(async (req, res) => {
  const { id, postId, userId, username } = req.query;
  const query = {};

  if (id?.trim()) {
    query._id = id.trim();
  } else if (postId?.trim()) {
    query.post = postId.trim();
  } else if (username?.trim()) {
    const user = await User.findOne({ username }).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "No user exists by this username");
    }

    query.user = user._id;
  } else if (userId?.trim()) {
    query.user = userId.trim();
  }

  const comments = await Comment.find({
    ...query,
    parent: { $exists: false },
  })
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "_id avatar username fullname" })
    .populate({ path: "post", model: "Post", select: "title" })
    .exec();

  if (!comments || comments.length === 0) {
    throw new ApiError(404, "No comments found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export const getCommentsByPostId = handleAsyncError(async (req, res) => {
  const { postId } = req.params;

  if (postId?.trim() === "") {
    throw new ApiError(400, "comment id must be provided");
  }

  const comments = await Comment.find({
    post: postId,
    parent: { $exists: false },
  })
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "_id avatar username fullname" })
    .populate({
      path: "children",
      model: "Comment",
    })
    .exec();

  if (!comments) {
    throw new ApiError(404, "No comment found with provided id");
  }

  // Populate children recursively
  for (const comment of comments) {
    await populateChildren(comment);
  }

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comment fetched successfully"));
});

export const getCommentsByUser = handleAsyncError(async (req, res) => {
  const { id, username, userId } = req.query;
  const query = {};

  if (id?.trim()) {
    query._id = id;
  } else if (username?.trim()) {
    const user = await User.findOne({ username }).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "No user exists by this username");
    }

    query.user = user._id;
  } else if (userId?.trim()) {
    query.user = userId.trim();
  }

  const comments = await Comment.find({
    ...query,
    parent: { $exists: false },
  })
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "_id avatar username fullname" })
    .populate({
      path: "post",
      model: "Post",
      select: "title",
    })
    .exec();

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comment fetched successfully"));
});

export const deleteComment = handleAsyncError(async (req, res) => {
  // not complete
  const { commentId } = req.params;

  if (commentId?.trim() === "") {
    throw new ApiError(400, "comment id must be provided");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "No comment found with provided id");
  }

  if (String(comment.user) !== String(req.user._id)) {
    throw new ApiError(
      403,
      "You are not authorized to modify this post. Only the author can make changes."
    );
  }

  if (comment.parent) {
    const parentComment = await Comment.findById(comment.parent);

    if (!parentComment) {
      throw new ApiError(404, "No parent comment found with provided id");
    }

    const idx = parentComment.children.findIndex(
      (childComment) => String(childComment) === String(comment._id)
    );
    parentComment.children.splice(idx, 1);
    await parentComment.save();
  } else {
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });
  }

  if (comment.children && comment.children.length > 0) {
    // await Promise.all(
    //   comment.children.map(async () => {
    //     return await Notification.deleteOne({
    //       user: req?.user?._id,
    //       relatedComment: commentId,
    //     });
    //   })
    // );

    // // Delete child comments in parallel
    // await Promise.all(
    //   comment.children.map(async (childId) => {
    //     return await Comment.findByIdAndDelete(childId);
    //   })
    // );

    await deleteNestedComments(commentId, req?.user?._id);
  } else {
    await Notification.deleteOne({
      user: req?.user?._id,
      relatedComment: commentId,
    });
  }

  await Comment.findByIdAndDelete(commentId);

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment removed successfully"));
});

async function deleteNestedComments(commentId, userId) {
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    await Notification.deleteMany({
      // user: userId,
      relatedComment: commentId,
    });

    if (comment.children && comment.children.length > 0) {
      await Promise.all(
        comment.children.map(async (childId) => {
          await deleteNestedComments(childId, userId);
        })
      );
    }

    await Comment.findByIdAndDelete(commentId);
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
  }
}
