import ApiError from "../../utils/ApiError.js";
import formatValidatorErrors from "../../utils/formatValidatorErrors.js";
import {
  createCommentSchema,
  deleteCommentSchema,
  getCommentsByPostIdSchema,
  getCommentsByUserSchema,
  getCommentSchema,
} from "../schemas/comment.schemas.js";

export function createCommentValidator(req, res, next) {
  const payload = { ...req.params, ...req.body };

  const { error } = createCommentSchema.validate(payload, {
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

export function getCommentValidator(req, res, next) {
  const { error } = getCommentSchema.validate(req.query, { abortEarly: false });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
}

export function getCommentsByPostIdValidator(req, res, next) {
  const { error } = getCommentsByPostIdSchema.validate(req.params, {
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

export function getCommentsByUserValidator(req, res, next) {
  const { error } = getCommentsByUserSchema.validate(req.query, {
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

export function deleteCommentValidator(req, res, next) {
  const { error } = deleteCommentSchema.validate(req.params, {
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
