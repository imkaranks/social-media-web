import Joi from "joi";

/*
getLikes (
const { user, username, post } = req.query; // all are optional
)

toggleLike (
const { type, id } = req.body;
)
*/

export const getLikesSchema = Joi.object({
  user: Joi.string().optional(),
  username: Joi.string().optional(),
  post: Joi.string().optional(),
});

export const toggleLikeSchema = Joi.object({
  type: Joi.string().valid("post", "comment").required(),
  id: Joi.string().required(),
});
