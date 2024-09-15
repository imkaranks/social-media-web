import mongoose, { Schema } from "mongoose";

const savedPostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  savedAt: { type: Date, default: Date.now },
});

const SavedPost = mongoose.model("SavedPost", savedPostSchema);

export default SavedPost;
