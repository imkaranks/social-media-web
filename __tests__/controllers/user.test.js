import request from "supertest";
import cloudinary from "cloudinary";
import app from "../../server/app.js";
import User from "../../server/models/user.model.js";
import { isAuthenticated } from "../../server/middlewares/auth.middleware.js";
import ApiError from "../../server/utils/ApiError.js";
import upload from "../../server/utils/cloudinary.js";

jest.mock("../../server/models/user.model.js"); // Mock User model
jest.mock("../../server/middlewares/auth.middleware.js"); // Mock the authentication middleware
jest.mock("cloudinary"); // Mock Cloudinary
jest.mock("../../server/utils/cloudinary.js"); // Mock the upload function

const mockUserId = "mockUserId"; // Simulated user ID

describe("User API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  describe("GET /user", () => {
    beforeEach(() => {
      // Mocking successful authentication
      isAuthenticated.mockImplementation((req, res, next) => {
        req.user = { _id: mockUserId, username: "testuser" }; // Simulate an authenticated user
        next();
      });
    });

    it("should return 401 if not authenticated", async () => {
      // Mock the middleware to simulate unauthorized access
      isAuthenticated.mockImplementation((req, res, next) => {
        return next(new ApiError(401, "Unauthorized request")); // Simulate an unauthorized error
      });

      const response = await request(app).get("/api/v1/user");
      expect(response.status).toBe(401);
    });

    it("should return 200 and users list if authenticated", async () => {
      const mockUsers = [
        { _id: "userId1", username: "user1", email: "user1@example.com" },
        { _id: "userId2", username: "user2", email: "user2@example.com" },
      ];

      // Mock User.find to return a mock function that allows chaining
      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers), // Mock the select method to return mockUsers
      });

      const response = await request(app).get("/api/v1/user");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        data: mockUsers,
        message: "Users fetch successfully",
        success: true,
      });
    });
  });

  describe("GET /user/profile", () => {
    beforeEach(() => {
      // Mocking successful authentication
      isAuthenticated.mockImplementation((req, res, next) => {
        req.user = { _id: mockUserId, username: "testuser" }; // Simulate an authenticated user
        next();
      });
    });

    it("should return 401 if not authenticated", async () => {
      // Mock the middleware to simulate unauthorized access
      isAuthenticated.mockImplementation((req, res, next) => {
        return next(new ApiError(401, "Unauthorized request")); // Simulate an unauthorized error
      });

      const response = await request(app).get("/api/v1/user/profile");
      expect(response.status).toBe(401);
    });

    it("should return 200 and user data if user exists", async () => {
      const mockUser = {
        _id: mockUserId,
        username: "testuser",
        fullname: "Test User",
        email: "test@user.co",
      };

      // Mock User.findOne to return the mock user
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const response = await request(app)
        .get("/api/v1/user/profile?id=mockUserId") // Use the query params to find the user
        .set("Authorization", "Bearer valid_token"); // Set a valid token in the header

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        status: 200,
        data: mockUser,
        message: "User fetched successfully",
      });
    });

    it("should return 404 if user does not exist", async () => {
      // Mock User.findOne to return null (user not found)
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app)
        .get("/api/v1/user/profile?id=mockUserId")
        .set("Authorization", "Bearer valid_token"); // Set a valid token in the header

      expect(response.status).toBe(404);
    });
  });

  describe("GET /user/search", () => {
    beforeEach(() => {
      // Mocking successful authentication
      isAuthenticated.mockImplementation((req, res, next) => {
        req.user = { _id: mockUserId, username: "testuser" }; // Simulate an authenticated user
        next();
      });
    });

    it("should return 401 if not authenticated", async () => {
      // Mock the middleware to simulate unauthorized access
      isAuthenticated.mockImplementation((req, res, next) => {
        return next(new ApiError(401, "Unauthorized request")); // Simulate an unauthorized error
      });

      const response = await request(app).get("/api/v1/user/search");
      expect(response.status).toBe(401);
    });

    it("should return 400 if keyword is not provided", async () => {
      const response = await request(app)
        .get("/api/v1/user/search?keyword=") // No keyword provided
        .set("Authorization", "Bearer valid_token");

      expect(response.status).toBe(400);
    });

    it("should return 200 and user list if keyword is provided", async () => {
      const mockUsers = [
        {
          _id: "userId1",
          username: "user1",
          fullname: "User One",
          email: "user1@example.com",
        },
        {
          _id: "userId2",
          username: "user2",
          fullname: "User Two",
          email: "user2@example.com",
        },
      ];

      // Mock User.find to simulate a successful search
      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers), // Mocking select to return mock users
      });

      const response = await request(app)
        .get("/api/v1/user/search?keyword=test") // Example keyword
        .set("Authorization", "Bearer valid_token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        data: mockUsers,
        message: "Users fetched successfully",
        success: true,
      });
    });
  });

  describe("PATCH /user/avatar/:userId", () => {
    beforeEach(() => {
      // Mocking successful authentication
      isAuthenticated.mockImplementation((req, res, next) => {
        req.user = { _id: mockUserId, username: "testuser" }; // Simulate an authenticated user
        next();
      });
    });

    it("should return 401 if not authenticated", async () => {
      // Mock the middleware to simulate unauthorized access
      isAuthenticated.mockImplementation((req, res, next) => {
        return next(new ApiError(401, "Unauthorized request")); // Simulate an unauthorized error
      });

      const response = await request(app).patch(
        "/api/v1/user/avatar/mockUserId"
      );
      expect(response.status).toBe(401);
    });

    it("should return 400 if no file is provided", async () => {
      const response = await request(app)
        .patch("/api/v1/user/avatar/mockUserId") // Example userId
        .set("Authorization", "Bearer valid_token");

      expect(response.status).toBe(400);
    });

    it("should return 200 and update the avatar if file is provided", async () => {
      const mockUser = {
        _id: "mockUserId",
        avatar: { public_id: "old_public_id" },
        save: jest.fn().mockResolvedValue(true), // Mock save method
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      }); // Mock user retrieval

      const mockUploadResult = {
        public_id: "new_public_id",
        url: "http://example.com/new-avatar.png",
      };
      upload.mockResolvedValue(mockUploadResult); // Mock Cloudinary upload

      const fileBuffer = Buffer.from("mock file data"); // Simulate file data

      const response = await request(app)
        .patch("/api/v1/user/avatar/mockUserId")
        .set("Authorization", "Bearer valid_token")
        .attach("avatar", fileBuffer, {
          filename: "avatar.png",
          contentType: "image/png",
        }); // Simulate file upload

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        data: {
          _id: mockUser._id,
          avatar: {
            public_id: mockUploadResult.public_id,
            url: mockUploadResult.url,
          },
        },
        message: "Avatar changed",
        success: true,
      });

      expect(cloudinary.v2.uploader.destroy).toHaveBeenCalledWith(
        "old_public_id"
      ); // Ensure old avatar is deleted
      expect(mockUser.save).toHaveBeenCalled(); // Ensure user is saved
    });
  });

  describe("PATCH /user/change-password", () => {
    beforeEach(() => {
      // Mocking successful authentication
      isAuthenticated.mockImplementation((req, res, next) => {
        req.user = { _id: mockUserId, username: "testuser" }; // Simulate an authenticated user
        next();
      });
    });

    it("should return 401 if not authenticated", async () => {
      // Mock the middleware to simulate unauthorized access
      isAuthenticated.mockImplementation((req, res, next) => {
        return next(new ApiError(401, "Unauthorized request")); // Simulate an unauthorized error
      });

      const response = await request(app).patch("/api/v1/user/change-password");
      expect(response.status).toBe(401);
    });

    it("should return 400 if old or new password is not provided", async () => {
      const response = await request(app)
        .patch("/api/v1/user/change-password")
        .send({ oldPassword: "", newPassword: "newPassword123" }); // Old password missing

      expect(response.status).toBe(400);
    });

    it("should return 404 if user is not found", async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      }); // Simulate user not found

      const response = await request(app)
        .patch("/api/v1/user/change-password")
        .send({ oldPassword: "oldPassword123", newPassword: "newPassword123" });

      expect(response.status).toBe(404);
    });

    it("should return 400 if old password is invalid", async () => {
      const mockUser = {
        _id: "mockUserId",
        didPasswordMatch: jest.fn().mockResolvedValue(false), // Simulate invalid old password
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      }); // Mock user retrieval

      const response = await request(app)
        .patch("/api/v1/user/change-password")
        .send({
          oldPassword: "wrongOldPassword",
          newPassword: "newPassword123",
        });

      expect(response.status).toBe(400);
    });

    it("should return 200 and update the password if old password is valid", async () => {
      const mockUser = {
        _id: "mockUserId",
        didPasswordMatch: jest.fn().mockResolvedValue(true), // Simulate valid old password
        save: jest.fn().mockResolvedValue(true), // Mock save method
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      }); // Mock user retrieval

      const response = await request(app)
        .patch("/api/v1/user/change-password")
        .send({ oldPassword: "oldPassword123", newPassword: "newPassword123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        data: {},
        message: "Password updated successfully",
        success: true,
      });

      expect(mockUser.password).toBe("newPassword123"); // Check that password is updated
      expect(mockUser.save).toHaveBeenCalled(); // Ensure user is saved
    });
  });

  describe("PATCH /user/:toBeupdatedUserId", () => {
    beforeEach(() => {
      // Mocking successful authentication
      isAuthenticated.mockImplementation((req, res, next) => {
        req.user = { _id: mockUserId, username: "testuser" }; // Simulate an authenticated user
        next();
      });
    });

    it("should return 401 if not authenticated", async () => {
      // Mock the middleware to simulate unauthorized access
      isAuthenticated.mockImplementation((req, res, next) => {
        return next(new ApiError(401, "Unauthorized request")); // Simulate an unauthorized error
      });

      const response = await request(app).patch("/api/v1/user/mockUserId");
      expect(response.status).toBe(401);
    });

    it("should return 403 if user tries to update another user's details", async () => {
      const response = await request(app)
        .patch("/api/v1/user/anotherMockUserId")
        .send({
          fullname: "New Name",
          username: "newusername",
          bio: "New Bio",
        });

      expect(response.status).toBe(403);
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .patch("/api/v1/user/mockUserId")
        .send({ fullname: "", username: "newusername", bio: "New Bio" }); // Missing fullname

      expect(response.status).toBe(400);
    });

    it("should return 404 if user is not found", async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      }); // Simulate user not found

      const response = await request(app)
        .patch("/api/v1/user/mockUserId")
        .send({
          fullname: "New Name",
          username: "newusername",
          bio: "New Bio",
        });

      expect(response.status).toBe(404);
    });

    it("should return 200 and update user details successfully", async () => {
      const mockUser = {
        _id: "mockUserId",
        avatar: { public_id: "old_avatar_id" },
        banner: { public_id: "old_banner_id" },
        save: jest.fn().mockResolvedValue(true), // Mock save method
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      }); // Mock user retrieval
      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          ...mockUser,
          fullname: "New Name",
          username: "newusername",
          bio: "New Bio",
        }),
      }); // Mock user updation

      const mockUploadResult = {
        public_id: "new_avatar_id",
        url: "http://example.com/new-avatar.png",
      };
      upload.mockResolvedValue(mockUploadResult); // Mock upload function

      cloudinary.v2.uploader.destroy = jest.fn().mockResolvedValue(true); // Mock Cloudinary destroy method

      const response = await request(app)
        .patch("/api/v1/user/mockUserId")
        .set("Authorization", "Bearer valid_token")
        .attach("avatar", Buffer.from("mock avatar data"), {
          filename: "avatar.png",
          contentType: "image/png",
        })
        .attach("banner", Buffer.from("mock banner data"), {
          filename: "banner.png",
          contentType: "image/png",
        })
        .field("fullname", "New Name")
        .field("username", "newusername")
        .field("bio", "New Bio");

      expect(response.status).toBe(200);
      // expect(response.body).toEqual({
      //   status: 200,
      //   data: {
      //     _id: mockUser._id,
      //     fullname: "New Name",
      //     username: "newusername",
      //     bio: "New Bio",
      //     avatar: {
      //       url: "http://example.com/new-avatar.png",
      //       public_id: "new_avatar_id",
      //     },
      //     banner: {
      //       url: "http://example.com/new-avatar.png",
      //       public_id: "new_avatar_id",
      //     },
      //   },
      //   message: "Updated user successfully",
      //   success: true,
      // });

      // expect(cloudinary.v2.uploader.destroy).toHaveBeenCalledWith(
      //   "old_avatar_id"
      // ); // Ensure old avatar is deleted
      // expect(cloudinary.v2.uploader.destroy).toHaveBeenCalledWith(
      //   "old_banner_id"
      // ); // Ensure old banner is deleted
      // expect(mockUser.save).toHaveBeenCalled(); // Ensure user is saved
    });
  });
});
