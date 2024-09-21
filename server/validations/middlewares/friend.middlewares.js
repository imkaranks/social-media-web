import ApiError from "../../utils/ApiError.js";
import formatValidatorErrors from "../../utils/formatValidatorErrors.js";
import {
  acceptFriendRequestSchema,
  getFriendRecommendationsSchema,
  getFriendsSchema,
  getPendingFriendRequestsSchema,
  rejectFriendRequestSchema,
  removeExistingFriendSchema,
  sendFriendRequestSchema,
} from "../schemas/friend.schemas.js";

export function sendFriendRequestValidator(req, res, next) {
  const { error } = sendFriendRequestSchema.validate(req.body, {
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

export function acceptFriendRequestValidator(req, res, next) {
  const { error } = acceptFriendRequestSchema.validate(req.body, {
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

export function rejectFriendRequestValidator(req, res, next) {
  const { error } = rejectFriendRequestSchema.validate(req.body, {
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

export function removeExistingFriendValidator(req, res, next) {
  const { error } = removeExistingFriendSchema.validate(req.params, {
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

export function getFriendsValidator(req, res, next) {
  const { error } = getFriendsSchema.validate(req.params, {
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

export function getPendingFriendRequestsValidator(req, res, next) {
  const { error } = getPendingFriendRequestsSchema.validate(req.params, {
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

export function getFriendRecommendationsValidator(req, res, next) {
  const payload = { ...req.params, ...req.query };

  const { error } = getFriendRecommendationsSchema.validate(payload, {
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
