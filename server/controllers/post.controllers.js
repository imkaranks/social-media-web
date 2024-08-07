import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import handleAsyncError from "../utils/handleAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import upload from "../utils/cloudinary.js";
import User from "../models/user.model.js";

export const createPost = handleAsyncError(async (req, res) => {
  const { title, content } = req.body;

  if ([title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Post title and content are required");
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files were uploaded");
  }

  const post = new Post({
    title,
    content,
    author: req.user._id,
  });
  const images = [];

  for (const file of req.files) {
    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;
    const result = await upload(dataURI);

    // Push the Cloudinary URL of the uploaded image to the array
    images.push({ public_id: result.public_id, url: result.url });
  }

  post.images = images;
  await post.save();

  const createdPost = await Post.findById(post._id).populate({
    path: "author",
    model: "User",
    select: "_id username fullname avatar",
  });

  res
    .status(201)
    .json(new ApiResponse(201, createdPost, "Post added successfully"));
});

export const getPosts = handleAsyncError(async (req, res) => {
  const { username, author, withEngagement } = req.query;
  const query = {};

  if (username?.trim()) {
    const user = await User.findOne({ username }).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "No user exists by this username");
    }

    query.author = user._id;
  } else if (author?.trim()) {
    query.author = author.trim();
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      model: "User",
      select: "_id username fullname avatar",
    })
    .populate({
      path: "likes",
      model: "User",
      select: "_id username fullname avatar",
    });

  let allPosts;
  if (withEngagement === "true") {
    allPosts = await Promise.all(
      posts.map(async (post) => {
        const likeCount = post.likes.length;
        const commentCount = post.comments.length;
        const userLikedPost = post.likes.some(
          (like) => like?._id?.toString() === req.user._id?.toString()
        );
        return { ...post._doc, likeCount, commentCount, userLikedPost };
      })
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        withEngagement === "true" ? allPosts : posts || [],
        "Post fetched Successfully"
      )
    );
});

// export const getAllPosts = handleAsyncError(async (req, res) => {
//   const posts = await Post.find({})
//     .sort({ createdAt: -1 })
//     .populate({
//       path: "author",
//       model: "User",
//       select: "_id username fullname avatar",
//     })
//     .populate({
//       path: "likes",
//       model: "User",
//       select: "_id username fullname avatar",
//     });

//   const allPosts = await Promise.all(
//     posts.map(async (post) => {
//       const likeCount = post.likes.length;
//       const commentCount = post.comments.length;
//       const userLikedPost = post.likes.some(
//         (like) => like?._id?.toString() === req.user._id?.toString()
//       );
//       return { ...post._doc, likeCount, commentCount, userLikedPost };
//     })
//   );

//   res
//     .status(200)
//     .json(new ApiResponse(200, allPosts || [], "Posts fetched Successfully"));
// });

export const getPostById = handleAsyncError(async (req, res) => {
  const { postId } = req.params;

  if (!postId || !postId.trim()) {
    throw new ApiError(400, "Post id is required");
  }

  const post = await Post.findById(postId)
    .populate({
      path: "author",
      model: "User",
      select: "_id username fullname avatar",
    })
    .populate({
      path: "likes",
      model: "User",
      select: "_id username fullname avatar",
    });

  if (!post) {
    throw new ApiError(404, "No post found with provided id");
  }

  const likeCount = post.likes.length;
  const commentCount = post.comments.length;
  const userLikedPost = post.likes.some(
    (like) => like?._id?.toString() === req.user._id?.toString()
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...post._doc, likeCount, userLikedPost, commentCount } || {},
        "Post fetched Successfully"
      )
    );
});

export const updatePost = handleAsyncError(async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  if ([title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Post title and content are required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "No post found with provided id");
  }

  if (String(post.author) !== String(req.user._id)) {
    throw new ApiError(
      403,
      "You are not authorized to modify this post. Only the author can make changes."
    );
  }

  const updatedPost = await Post.findByIdAndUpdate(
    post._id,
    { title, content },
    { new: true, runValidators: true }
  );

  if (req?.files && req?.files?.length) {
    if (updatedPost.images.length) {
      const imagesPublicIds = updatedPost.images.map(
        (image) => image.public_id
      );

      await cloudinary.api.delete_resources(imagesPublicIds);
    }
    const images = [];

    for (const file of req.files) {
      const result = await upload(file.path);

      // If upload to Cloudinary is successful, delete the local file
      fs.unlinkSync(file.path);

      // Push the Cloudinary URL of the uploaded image to the array
      images.push({ public_id: result.public_id, url: result.url });
    }

    updatedPost.images = images;
    await updatedPost.save();
  }

  res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
});

export const deletePost = handleAsyncError(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "No post found with provided id");
  }

  if (String(post.author) !== String(req.user._id)) {
    throw new ApiError(
      403,
      "You are not authorized to modify this post. Only the author can make changes."
    );
  }

  if (post.images.length) {
    const imagesPublicIds = post.images.map((image) => image.public_id);

    await cloudinary.api.delete_resources(imagesPublicIds);
  }

  // Delete associated comments and likes
  await Promise.all([
    Comment.deleteMany({ post: postId }),
    Like.deleteMany({ post: postId }),
  ]);

  await Post.findByIdAndDelete(postId);

  res.status(200).json(new ApiResponse(200, post, "Post removed successfully"));
});
