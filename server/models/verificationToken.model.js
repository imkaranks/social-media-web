import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["VERIFY_EMAIL", "RESET_PASSWORD"],
    default: "VERIFY_EMAIL",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "30m", // Automatically delete documents older than 30 mins
  },
});

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationToken;
