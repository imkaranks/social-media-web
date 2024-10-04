import ApiError from "../../utils/ApiError.js";
import formatValidatorErrors from "../../utils/formatValidatorErrors.js";
import {
  deleteSavedPostSchema,
  getSavedPostSchema,
  savePostSchema,
} from "../schemas/savedPost.schemas.js";

export function savePostValidator(req, res, next) {
  const { error } = savePostSchema.validate(req.params, {
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

export function getSavedPostValidator(req, res, next) {
  const { error } = getSavedPostSchema.validate(req.params, {
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

export function deleteSavedPostValidator(req, res, next) {
  const { error } = deleteSavedPostSchema.validate(req.params, {
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
