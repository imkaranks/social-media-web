import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import upload from "../utils/cloudinary.js";

export const getAllPosts = catchAsyncError(async (req, res) => {
  const posts = await Post.find({ author: req.user._id });

  res
    .status(200)
    .json(new ApiResponse(200, posts || [], "Post fetched Successfully"));
});

export const createPost = catchAsyncError(async (req, res) => {
  const { title, content } = req.body;

  if ([title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill all the fields");
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files were uploaded.");
  }

  const post = new Post({
    title,
    content,
    author: req.user._id,
  });
  const images = [];

  for (const file of req.files) {
    const result = await upload(file.path);

    // If upload to Cloudinary is successful, delete the local file
    fs.unlinkSync(file.path);

    // Push the Cloudinary URL of the uploaded image to the array
    images.push({ public_id: result.public_id, url: result.url });
  }

  post.images = images;
  await post.save();

  res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

export const deletePost = catchAsyncError(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (String(post.author) !== String(req.user._id)) {
    throw new ApiError(
      403,
      "You are not authorized to modify this post. Only the author can make changes."
    );
  }

  const imagesPublicIds = post.images.map((image) => image.public_id);

  await cloudinary.api.delete_resources(imagesPublicIds);

  await Post.findByIdAndDelete(postId);

  res.status(200).json(new ApiResponse(200, post, "Post deleted successfully"));
});
