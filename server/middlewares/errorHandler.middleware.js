import ApiResponse from "../utils/ApiResponse.js";

const errorHandler = (error, req, res, next) => {
  return res
    .status(error.status || 400)
    .json(new ApiResponse(error.status, error, error.message));
};

export default errorHandler;
