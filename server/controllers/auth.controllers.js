import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import VerificationToken from "../models/verificationToken.model.js";
import { sendMail } from "../utils/sendMail.js";

const generateAuthTokens = async (userId, res) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.getAccessToken();
    const refreshToken = await user.getRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    // Set options for cookies
    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000, // 1 days
      secure: process.env.NODE_ENV === "production", // Secure flag only for production
      httpOnly: true, // Prevent XSS attacks
      sameSite: "strict", // Prevent CSRF attacks
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating tokens: ",
      error
    );
  }
};

const sendVerificationEmail = async (email, token) => {
  try {
    return await sendMail({
      email,
      subject: "Verification for QuietSphere",
      text: "Click the link below to verify your email address:",
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <meta charset="UTF-8" />
            <meta content="width=device-width, initial-scale=1" name="viewport" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <title></title>
            <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet" />
          </head>

          <body>
            <div style="margin: 0 auto; max-width: 600px; font-family: Roboto, Arial, sans-serif;">
              <header style="padding: 20px 0; text-align: center;">
                <a style="text-decoration: none; color: black; font-size: 22px; font-weight: 600;" href="${process.env.CORS_ORIGIN}">
                  QuietSphere
                </a>
              </header>
              <div style="background-color: #365cce; color: white; text-align: center; padding: 20px 0;">
                <div style="margin-top: 10px;">
                  <div style="font-size: 12px; font-weight: normal; text-transform: uppercase;">THANKS FOR SIGNING UP!</div>
                  <div style="font-size: 24px; font-weight: bold; text-transform: capitalize; margin-top: 10px;">Verify your E-mail Address</div>
                </div>
              </div>
              <div style="padding: 20px;">
                <h2 style="color: #333;">Hey there,</h2>
                <p style="margin-top: 10px; line-height: 1.6; color: #666;">Please use the following call to action</p>
                <p style="margin-top: 10px; line-height: 1.6; color: #666;">
                  This verification token will only be valid for the next <span style="font-weight: bold;">30 minutes</span>. If the verification token does not work, you can login again and new verification token will be sent to you. Use the
                  verification link below:
                </p>
                <a
                  href="${process.env.CORS_ORIGIN}/verify/?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}"
                  style="
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #ffa500;
                    color: white;
                    text-decoration: none;
                    font-weight: bold;
                    text-transform: uppercase;
                    border-radius: 4px;
                    transition: background-color 0.3s ease;
                  "
                >
                  Verify email
                </a>
                <p style="margin-top: 20px; line-height: 1.6; color: #666;">
                  Thank you,<br />
                  QuietSphere Team
                </p>
              </div>
              <p style="color: #999; font-size: 12px; padding: 0 20px; margin-top: 20px;">
                This email was sent from <a href="#" style="color: #365cce; text-decoration: none;">no-reply@quietsphere.com</a>. If you'd rather not receive this kind of email, you can
                <a href="#" style="color: #365cce; text-decoration: none;">unsubscribe</a> or <a href="#" style="color: #365cce; text-decoration: none;">manage your email preferences</a>.
              </p>
              <footer style="background-color: rgba(0, 0, 0, 0.1); padding: 20px;">
                <div>
                  <div style="text-align: center; margin: auto;">
                    <h1 style="color: #365cce; font-weight: 600; text-transform: uppercase; font-size: 16px;">Get in touch</h1>
                    <a href="#" style="color: #999; text-decoration: none; display: block; margin-top: 5px;" alt="9876543210">9876543210</a>
                    <a href="#" style="color: #999; text-decoration: none; display: block; margin-top: 5px;" alt="no-reply@quietsphere.com">no-reply@quietsphere.com</a>
                  </div>
                  <div style="margin-top: 10px; margin: auto;">
                    <a href="#" style="color: gray; display: inline-block; margin-right: 10px;">
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h16v16H0z"></path>
                        <path
                          d="M16 8.049c0-4.446-3.582-8.05-8-8.05-4.418 0-8 3.604-8 8.05 0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
                        ></path>
                      </svg>
                    </a>
                    <a href="#" style="color: gray; display: inline-block; margin-right: 10px;">
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 4.2V11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4.2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2zm-5.009 1.747a1.751 1.751 0 1 0 0 3.502 1.751 1.751 0 0 0 0-3.502zm1.25 4.662H7.76V9.573h3.48v.036c-.004.483.03.963.09 1.44a3.43 3.43 0 0 0 2.748-1.46l1.162.078a4.168 4.168 0 0 1-3.91 2.896zm2.5-6.908h-3V6.4h3v-.391z"
                        ></path>
                      </svg>
                    </a>
                    <a href="#" style="color: gray; display: inline-block; margin-right: 10px;">
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M512 378.7c-73.4 0-133.3 59.9-133.3 133.3S438.6 645.3 512 645.3 645.3 585.4 645.3 512 585.4 378.7 512 378.7zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zM512 717.1c-113.5 0-205.1-91.6-205.1-205.1S398.5 306.9 512 306.9 717.1 398.5 717.1 512 625.5 717.1 512 717.1zm213.5-370.7c-26.5 0-47.9-21.4-47.9-47.9s21.4-47.9 47.9-47.9 47.9 21.4 47.9 47.9a47.84 47.84 0 0 1-47.9 47.9z"
                        ></path>
                      </svg>
                    </a>
                    <a href="#" style="color: gray; display: inline-block;">
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h16v16H0z"></path>
                        <path
                          d="M16 8.049c0-4.446-3.582-8.05-8-8.05-4.418 0-8 3.604-8 8.05 0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
                <div style="background-color: #365cce; padding: 10px; text-align: center; margin-top: 10px; color: white;">
                  <p style="margin: 0;">© ${new Date().getFullYear()} QuietSphere. All Rights Reserved.</p>
                </div>
              </footer>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    throw new Error(error?.message || "Error while sending verification email");
  }
};

export const signup = catchAsyncError(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (
    ![fullname, username, email, password].every(
      (field) => field && field.trim() !== ""
    )
  ) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(
      409,
      "Username or email is already registered. Please choose a different one."
    );
  }

  const user = await User.create({
    fullname,
    username,
    email,
    password,
    avatar: { url: `https://robohash.org/${username}` },
  });

  if (!user) {
    throw new ApiError(
      500,
      "User registration failed. Please try again later."
    );
  }

  const token = crypto.randomBytes(20).toString("hex");

  const verificationToken = await VerificationToken.create({
    user: user._id,
    token,
  });

  if (!verificationToken) {
    throw new ApiError(
      500,
      "Verification token creation failed. Please try again later."
    );
  }

  await sendVerificationEmail(user.email, token);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        "User registered successfully. Please check your email to verify your account."
      )
    );
});

export const verifyEmail = catchAsyncError(async (req, res) => {
  const { email, token } = req.params;

  if (!token?.trim()) {
    throw new ApiError(400, "Verification token is missing or invalid.");
  }

  if (!email?.trim()) {
    throw new ApiError(400, "Email is missing or invalid.");
  }

  const user = await User.findOne({ email }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(400, "No user found with this email");
  }

  if (user.isVerified) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email is already verified."));
  }

  const verificationToken = await VerificationToken.findOne({ token });

  if (
    !verificationToken ||
    verificationToken.createdAt < new Date(new Date() - 30 * 60 * 1000)
  ) {
    throw new ApiError(400, "Invalid or expired verification token.");
  }

  user.isVerified = true;
  await user.save();

  await VerificationToken.deleteOne({ token });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully."));
});

export const resendVerificationToken = catchAsyncError(async (req, res) => {
  const { email } = req.params;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "No user found with this email");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const existingToken = await VerificationToken.findOne({ user: user._id });

  if (existingToken) {
    await sendVerificationEmail(email, existingToken.token);

    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "Verification token resent successfully.")
      );
  }

  const token = crypto.randomBytes(20).toString("hex");

  await VerificationToken.create({
    user: user._id,
    token,
  });

  await sendVerificationEmail(email, token);

  return res
    .status(200)
    .json(
      new ApiResponse(201, {}, "New verification token sent successfully.")
    );
});

export const signin = catchAsyncError(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isValidPassword = await user.didPasswordMatch(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid user credentials");
  }

  if (!user.isVerified) {
    const existingToken = await VerificationToken.findOne({ user: user._id });

    if (existingToken) {
      await sendVerificationEmail(email, existingToken.token);
    } else {
      const token = crypto.randomBytes(20).toString("hex");

      await VerificationToken.create({
        user: user._id,
        token,
      });

      await sendVerificationEmail(email, token);
    }

    throw new ApiError(
      403,
      "Please verify your account. Check your email for the verification link."
    );
  }

  // Generate authentication token and set cookie
  const { accessToken } = await generateAuthTokens(user._id, res);

  const authenticatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: authenticatedUser, accessToken },
        "User logged in successfully"
      )
    );
});

export const signout = catchAsyncError(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401);
  }

  await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  // Set options for cookies
  const cookieOptions = {
    maxAge: 0, // Set to expire immediately
    secure: process.env.NODE_ENV === "production", // Secure flag only for production
    httpOnly: true, // Prevent XSS attacks
    sameSite: "strict", // Prevent CSRF attacks
  };

  // Clear JWT cookie on logout
  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);

  return res.status(200).json(new ApiResponse(200, {}, "User logged out"));
});

export const refreshAccessToken = catchAsyncError(async (req, res) => {
  const cookies = req.cookies;
  const incomingRefreshToken = cookies?.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id);

  if (!user) throw new ApiError(404, "User not found");

  if (incomingRefreshToken !== user?.refreshToken)
    throw new ApiError(403, "Refresh token mismatch");

  const { accessToken } = await generateAuthTokens(user._id, res);

  const authenticatedUser = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: authenticatedUser, accessToken },
        "Access token refreshed"
      )
    );
});
