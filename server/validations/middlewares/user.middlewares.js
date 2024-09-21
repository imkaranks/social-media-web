import ApiError from "../../utils/ApiError.js";
import formatValidatorErrors from "../../utils/formatValidatorErrors.js";
import {
  changeAvatarSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  getUserByIdSchema,
  getUserByUsernameSchema,
  getUserSchema,
  resendResetPasswordTokenSchema,
  resetPasswordSchema,
  searchUsersSchema,
  updateUserSchema,
} from "../schemas/user.schemas.js";

export function getUserValidator(req, res, next) {
  const { error } = getUserSchema.validate(req.query, {
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

export function getUserByIdValidator(req, res, next) {
  const { error } = getUserByIdSchema.validate(req.params, {
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

export function getUserByUsernameValidator(req, res, next) {
  const { error } = getUserByUsernameSchema.validate(req.params, {
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

export function searchUsersValidator(req, res, next) {
  const { error } = searchUsersSchema.validate(req.query, {
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

export function changeAvatarValidator(req, res, next) {
  const { error } = changeAvatarSchema.validate(req.params, {
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

export function updateUserValidator(req, res, next) {
  const payload = { ...req.params, ...req.body };

  const { error } = updateUserSchema.validate(payload, {
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

export function forgotPasswordValidator(req, res, next) {
  const { error } = forgotPasswordSchema.validate(req.body, {
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

export function resetPasswordValidator(req, res, next) {
  const { error } = resetPasswordSchema.validate(req.body, {
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

export function resendResetPasswordTokenValidator(req, res, next) {
  const { error } = resendResetPasswordTokenSchema.validate(req.body, {
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

export function changePasswordValidator(req, res, next) {
  const { error } = changePasswordSchema.validate(req.body, {
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
