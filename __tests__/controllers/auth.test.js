import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../server/app.js";
import User from "../../server/models/user.model.js";
import VerificationToken from "../../server/models/verificationToken.model.js";
import sendVerificationEmail from "../../server/utils/sendVerificationEmail.js";
import generateAuthTokens from "../../server/utils/generateAuthTokens.js";
import upload from "../../server/utils/cloudinary.js";

jest.mock("../../server/models/user.model.js"); // Mock the User model
jest.mock("../../server/models/verificationToken.model.js"); // Mock the VerificationToken model
jest.mock("../../server/utils/sendVerificationEmail.js");
jest.mock("../../server/utils/generateAuthTokens.js");
jest.mock("../../server/utils/cloudinary.js");

describe("Authentication API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  describe("Signin API tests", () => {
    it("should return 400 if neither username nor email is provided", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signin")
        .send({ password: "testpassword" });

      expect(response.status).toBe(400);
      // expect(response.body).toHaveProperty(
      //   "message",
      //   "Username or email is required"
      // );
    });

    it("should return 404 if user is not found", async () => {
      User.findOne.mockResolvedValue(null); // Mock user not found

      const response = await request(app).post("/api/v1/auth/signin").send({
        username: "nonexistent",
        email: "test@user.co",
        password: "testpassword",
      });

      expect(response.status).toBe(404);
    });

    it("should return 401 if password is invalid", async () => {
      User.findOne.mockResolvedValue({
        username: "testuser",
        didPasswordMatch: jest.fn().mockResolvedValue(false), // Mock password mismatch
      });

      const response = await request(app).post("/api/v1/auth/signin").send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
    });

    it("should return 403 if the user is not verified", async () => {
      const mockUser = {
        _id: "123",
        isVerified: false,
        didPasswordMatch: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);
      VerificationToken.findOne.mockResolvedValue(null); // No existing token

      const response = await request(app)
        .post("/api/v1/auth/signin")
        .send({ username: "testuser", password: "testpassword" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Please verify your account. Check your email for the verification link."
      );
      expect(sendVerificationEmail).toHaveBeenCalled(); // Check if email function was called
    });

    it("should return 200 and accessToken if login is successful", async () => {
      const mockUser = {
        _id: "123",
        username: "testuser",
        isVerified: true,
        didPasswordMatch: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);
      // Mocking the findById method to return an object that mimics a Mongoose document
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser), // Mocking the select method
      });

      generateAuthTokens.mockResolvedValue({ accessToken: "mockAccessToken" });

      const response = await request(app).post("/api/v1/auth/signin").send({
        username: "testuser",
        email: "test@user.co",
        password: "testpassword",
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty(
        "accessToken",
        "mockAccessToken"
      );
      expect(response.body.data).toHaveProperty("user"); // Ensure user is returned
    });
  });

  describe("Signup API tests", () => {
    it("should return 400 if fullname, username, email and password is not provided", async () => {
      const response = await request(app).post("/api/v1/auth/signup").send({});

      expect(response.status).toBe(400);
    });

    it("should return 409 if username and email is already registered", async () => {
      const mockUser = {
        _id: "123",
        username: "testuser",
        email: "test@user.co",
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).post("/api/v1/auth/signup").send({
        fullname: "test user",
        username: "testuser",
        email: "test@user.co",
        password: "password",
      });

      expect(response.status).toBe(409);
    });

    it("should return 201 if signup is successful", async () => {
      const mockUser = {
        _id: "123",
        fullname: "Test User",
        username: "testuser",
        email: "test@example.com",
      };

      User.findOne.mockResolvedValueOnce(null); // No existing user
      User.findOne.mockResolvedValue(mockUser);
      User.create.mockResolvedValue(mockUser);
      VerificationToken.create.mockResolvedValue({}); // Mock verification token creation
      sendVerificationEmail.mockResolvedValue(true); // Mock sending verification email

      generateAuthTokens.mockResolvedValue({ accessToken: "mockAccessToken" });

      const response = await request(app).post("/api/v1/auth/signup").send({
        fullname: "Test User",
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      });

      expect(response.status).toBe(201);
      expect(User.create).toHaveBeenCalled(); // Ensure user creation was attempted
      expect(sendVerificationEmail).toHaveBeenCalledWith(
        "test@example.com",
        expect.any(String)
      ); // Check if verification email was sent
    });

    it("should handle file upload", async () => {
      const mockUploadResult = { public_id: "mockId", url: "mockUrl" };
      User.findOne.mockResolvedValueOnce(null); // No existing user
      User.create.mockResolvedValue({
        _id: "userId",
        email: "test@example.com",
      });
      VerificationToken.create.mockResolvedValue({});
      upload.mockResolvedValue(mockUploadResult); // Mock upload service
      sendVerificationEmail.mockResolvedValue(true);

      const file = Buffer.from("test image"); // Simulate a file
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .attach("avatar", file, {
          filename: "test.png",
          contentType: "image/png",
        }) // Attach file
        .field("fullname", "Test User")
        .field("username", "testuser")
        .field("email", "test@example.com")
        .field("password", "testpassword");

      expect(response.status).toBe(201);
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fullname: "Test User",
          username: "testuser",
          email: "test@example.com",
          password: "testpassword",
          avatar: { public_id: "mockId", url: "mockUrl" }, // Check avatar is set correctly
        })
      );
    });
  });

  describe("Logout API tests", () => {
    let token;

    beforeAll(async () => {
      // Create a test user
      const user = await User.create({
        fullname: "Test User",
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      });

      // Generate a token for the user
      token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      });
    });

    afterAll(async () => {
      await User.deleteMany({ username: "testuser" }); // Cleanup
    });

    it("should return 401 if not authenticated", async () => {
      const response = await request(app).post("/api/v1/auth/signout");

      expect(response.status).toBe(401);
    });

    it("should return 200 if logout is successful", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signout")
        .set("Authorization", `Bearer ${token}`); // Set the token in the Authorization header

      expect(response.status).toBe(200);
    });
  });
});
