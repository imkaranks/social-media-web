import Joi from "joi";
/*
createPost (
const { title, content } = req.body;
)

getPosts (
const { username, author, withEngagement } = req.query; 
)

getPostById (
const { postId } = req.params;
)

updatePost (
const { postId } = req.params;
  const { title, content } = req.body;
)

deletePost (
const { postId } = req.params;
)

searchPosts (
  const { keyword } = req.query;
)
*/

export const createPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export const getPostsSchema = Joi.object({
  username: Joi.string().optional(),
  author: Joi.string().optional(),
  withEngagement: Joi.boolean().optional(),
});

export const getPostByIdSchema = Joi.object({
  postId: Joi.string().required(),
});

export const updatePostSchema = Joi.object({
  postId: Joi.string().required(),
  title: Joi.string().optional(),
  content: Joi.string().optional(),
});

export const deletePostSchema = Joi.object({
  postId: Joi.string().required(),
});

export const searchPostsSchema = Joi.object({
  keyword: Joi.string().required(),
});
