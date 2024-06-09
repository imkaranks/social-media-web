const catchAsyncError = (callback) => (req, res, next) => {
  Promise.resolve(callback(req, res, next)).catch((error) => next(error));
};

export default catchAsyncError;
