import ApiError from "../../utils/ApiError.js";
import formatValidatorErrors from "../../utils/formatValidatorErrors.js";
import {
  createPostSchema,
  deletePostSchema,
  getPostByIdSchema,
  getPostsSchema,
  searchPostsSchema,
  updatePostSchema,
} from "../schemas/post.schemas.js";

export function createPostValidator(req, res, next) {
  const { error } = createPostSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
}

export function getPostsValidator(req, res, next) {
  const { error } = getPostsSchema.validate(req.query, {
    abortEarly: false,
  });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
}

export function getPostByIdValidator(req, res, next) {
  const { error } = getPostByIdSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
}

export function updatePostValidator(req, res, next) {
  const payload = { ...req.params, ...req.body };

  const { error } = updatePostSchema.validate(payload, {
    abortEarly: false,
  });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
}

export function deletePostValidator(req, res, next) {
  const { error } = deletePostSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
}

export function searchPostsValidator(req, res, next) {
  const { error } = searchPostsSchema.validate(req.query, {
    abortEarly: false,
  });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
}
