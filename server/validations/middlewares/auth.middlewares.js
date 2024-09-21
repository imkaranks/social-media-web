import {
  resendVerificationTokenSchema,
  signinSchema,
  signupSchema,
  verifyEmailSchema,
} from "../schemas/auth.schemas.js";
import ApiError from "../../utils/ApiError.js";
import formatValidatorErrors from "../../utils/formatValidatorErrors.js";

export const signupValidator = (req, res, next) => {
  const { error } = signupSchema.validate(req.body, { abortEarly: false });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
};

export const verifyEmailValidator = (req, res, next) => {
  const { error } = verifyEmailSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
};

export const resendVerificationTokenValidator = (req, res, next) => {
  const { error } = resendVerificationTokenSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
};

export const signinValidator = (req, res, next) => {
  const { error } = signinSchema.validate(req.body, { abortEarly: false });

  if (error)
    throw new ApiError(
      400,
      formatValidatorErrors(error),
      error.details.map((detail) => detail.message)
    );

  next();
};
