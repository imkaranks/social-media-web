import Joi from "joi";

// Schema for creating a comment
export const createCommentSchema = Joi.object({
  postId: Joi.string().required(),
  content: Joi.string().required(),
  parentId: Joi.string().optional(),
});

// Schema for getting a comment (query parameters)
export const getCommentSchema = Joi.object({
  id: Joi.string().optional(),
  postId: Joi.string().optional(),
  userId: Joi.string().optional(),
  username: Joi.string().optional(),
});

// Schema for getting comments by post ID
export const getCommentsByPostIdSchema = Joi.object({
  postId: Joi.string().required(),
});

// Schema for getting comments by user (query parameters)
export const getCommentsByUserSchema = Joi.object({
  id: Joi.string().optional(),
  username: Joi.string().optional(),
  userId: Joi.string().optional(),
});

// Schema for deleting a comment
export const deleteCommentSchema = Joi.object({
  commentId: Joi.string().required(),
});
