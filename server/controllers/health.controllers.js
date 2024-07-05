import handleAsyncError from "../utils/handleAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const healthCheck = handleAsyncError(async (req, res) => {
  const response = new ApiResponse(200, {}, "Server is up and running");

  res.status(response.status).json(response);
});
