import ApiError from "../../utils/ApiError.js";
import formatValidatorErrors from "../../utils/formatValidatorErrors.js";
import { getLikesSchema, toggleLikeSchema } from "../schemas/like.schemas.js";

export function getLikesValidator(req, res, next) {
  const { error } = getLikesSchema.validate(req.query, {
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

export function toggleLikeValidator(req, res, next) {
  const { error } = toggleLikeSchema.validate(req.body, {
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
