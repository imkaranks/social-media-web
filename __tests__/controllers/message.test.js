import request from "supertest";
import app from "../../server/app.js";
import Conversation from "../../server/models/conversation.model.js";
import Message from "../../server/models/message.model.js";
import { isAuthenticated } from "../../server/middlewares/auth.middleware.js";
import { io, getSocketId } from "../../server/socket/socket.js";
import ApiResponse from "../../server/utils/ApiResponse.js";
import ApiError from "../../server/utils/ApiError.js";

jest.mock("../../server/models/conversation.model.js"); // Mock Conversation model
jest.mock("../../server/models/message.model.js"); // Mock Message model
jest.mock("../../server/middlewares/auth.middleware.js"); // Mock the authentication middleware
jest.mock("../../server/socket/socket.js"); // Mock the socket utility

describe("Message API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  describe("POST /message/send/:receiverId", () => {
    beforeEach(() => {
      // Mocking successful authentication
      isAuthenticated.mockImplementation((req, res, next) => {
        req.user = { _id: "mockSenderId" }; // Simulate an authenticated user
        next();
      });
    });

    it("should return 401 if not authenticated", async () => {
      // Mock the middleware to simulate unauthorized access
      isAuthenticated.mockImplementation((req, res, next) => {
        return next(new ApiError(401, "Unauthorized request")); // Simulate an unauthorized error
      });

      const response = await request(app).post(
        "/api/v1/message/send/mockReceiverId"
      );
      expect(response.status).toBe(401);
    });

    it("should return 400 if fields are missing", async () => {
      const response = await request(app)
        .post("/api/v1/message/send/mockReceiverId")
        .send({}); // Missing message

      expect(response.status).toBe(400);
    });

    it("should create a new conversation and send a message", async () => {
      const mockMessage = { _id: "mockMessageId", message: "Hello" };
      const mockConversation = {
        _id: "mockConversationId",
        participants: ["mockSenderId", "mockReceiverId"],
        messages: [],
        save: jest.fn().mockResolvedValue(true), // Mock save method
      };

      // Mocking the creation of a conversation and message
      Conversation.findOne.mockResolvedValue(null); // No existing conversation
      Conversation.create.mockResolvedValue(mockConversation); // Create new conversation
      Message.create.mockResolvedValue(mockMessage); // Create new message

      const response = await request(app)
        .post("/api/v1/message/send/mockReceiverId")
        .send({ message: "Hello" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(new ApiResponse(201, mockMessage));

      expect(Conversation.findOne).toHaveBeenCalledWith({
        participants: { $all: ["mockSenderId", "mockReceiverId"] },
      });
      expect(Conversation.create).toHaveBeenCalledWith({
        participants: ["mockSenderId", "mockReceiverId"],
      });
      expect(Message.create).toHaveBeenCalledWith({
        sender: "mockSenderId",
        receiver: "mockReceiverId",
        message: "Hello",
      });
      expect(mockConversation.messages).toContain(mockMessage); // Ensure message is added to conversation
      expect(mockConversation.save).toHaveBeenCalled(); // Ensure conversation is saved
    });

    it("should send a message to an existing conversation", async () => {
      const mockMessage = { _id: "mockMessageId", message: "Hello" };
      const mockConversation = {
        _id: "mockConversationId",
        participants: ["mockSenderId", "mockReceiverId"],
        messages: [],
        save: jest.fn().mockResolvedValue(true), // Mock save method
      };

      // Mock existing conversation
      Conversation.findOne.mockResolvedValue(mockConversation);
      Message.create.mockResolvedValue(mockMessage); // Create new message

      const response = await request(app)
        .post("/api/v1/message/send/mockReceiverId")
        .send({ message: "Hello" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(new ApiResponse(201, mockMessage));

      expect(Conversation.findOne).toHaveBeenCalledWith({
        participants: { $all: ["mockSenderId", "mockReceiverId"] },
      });
      expect(Message.create).toHaveBeenCalledWith({
        sender: "mockSenderId",
        receiver: "mockReceiverId",
        message: "Hello",
      });
      expect(mockConversation.messages).toContain(mockMessage); // Ensure message is added to conversation
      expect(mockConversation.save).toHaveBeenCalled(); // Ensure conversation is saved
    });

    it("should emit a new message to the receiver's socket", async () => {
      const mockMessage = { _id: "mockMessageId", message: "Hello" };
      const mockConversation = {
        _id: "mockConversationId",
        participants: ["mockSenderId", "mockReceiverId"],
        messages: [],
        save: jest.fn().mockResolvedValue(true), // Mock save method
      };

      // Mocking existing conversation
      Conversation.findOne.mockResolvedValue(mockConversation);
      Message.create.mockResolvedValue(mockMessage); // Create new message

      // Mocking socket ID retrieval
      getSocketId.mockReturnValue("mockSocketId");
      io.to = jest.fn().mockReturnThis(); // Mock socket emission

      const response = await request(app)
        .post("/api/v1/message/send/mockReceiverId")
        .send({ message: "Hello" });

      expect(response.status).toBe(201);
      expect(io.to).toHaveBeenCalledWith("mockSocketId"); // Ensure socket emission is called
      expect(io.to().emit).toHaveBeenCalledWith("new-message", mockMessage); // Ensure new message event is emitted
    });
  });

  describe("GET /message/:id", () => {
    beforeEach(() => {
      // Mocking successful authentication
      isAuthenticated.mockImplementation((req, res, next) => {
        req.user = { _id: "mockSenderId" }; // Simulate an authenticated user
        next();
      });
    });

    it("should return 401 if not authenticated", async () => {
      // Mock the middleware to simulate unauthorized access
      isAuthenticated.mockImplementation((req, res, next) => {
        return next(new ApiError(401, "Unauthorized request")); // Simulate an unauthorized error
      });

      const response = await request(app).get("/api/v1/message/mockReceiverId");
      expect(response.status).toBe(401);
    });

    it("should return 400 if sender or receiver is missing", async () => {
      isAuthenticated.mockImplementation((req, res, next) => {
        req.user = null; // Missing sender
        next();
      });

      const response = await request(app).get("/api/v1/message/mockReceiverId");

      expect(response.status).toBe(400);
    });

    it("should return 404 if no conversation is found", async () => {
      const mockReceiverId = "mockReceiverId";

      Conversation.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      }); // No existing conversation

      const response = await request(app)
        .get(`/api/v1/message/${mockReceiverId}`)
        .query({}); // No query params needed for this test

      expect(response.status).toBe(404);
    });

    it("should return messages if conversation is found", async () => {
      const mockReceiverId = "mockReceiverId";
      const mockMessages = [
        { _id: "messageId1", message: "Hello" },
        { _id: "messageId2", message: "Hi there" },
      ];
      const mockConversation = {
        participants: ["mockSenderId", "mockReceiverId"],
        messages: mockMessages,
      };

      Conversation.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockConversation),
      }); // Mock existing conversation

      const response = await request(app)
        .get(`/api/v1/message/${mockReceiverId}`)
        .query({}); // No query params needed for this test

      expect(response.status).toBe(200);
      expect(response.body).toEqual(new ApiResponse(200, mockMessages));
    });
  });
});
