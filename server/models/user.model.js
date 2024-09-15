import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [2, "Full name should be at least 2 characters long"],
      maxlength: [50, "Full name should not exceed 50 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username is already taken"],
      lowercase: true,
      minlength: [3, "Username should be at least 3 characters long"],
      maxlength: [20, "Username should not exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already registered"],
      minlength: [6, "Email should be at least 6 characters long"],
      maxlength: [50, "Email should not exceed 50 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should be at least 6 characters long"],
    },
    bio: {
      type: String,
      maxlength: [160, "Bio should not exceed 160 characters"],
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    banner: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

userSchema.methods.didPasswordMatch = async function (incomingPassword) {
  return await bcrypt.compare(incomingPassword, this.password);
};

userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
