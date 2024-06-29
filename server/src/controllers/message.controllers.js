import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getSocketId, io } from "../socket/socket.js";

export const sendMessage = catchAsyncError(async (req, res) => {
  const { message } = req.body;
  const sender = req.user._id;
  const { id: receiver } = req.params;

  // Validate fields
  if (![message, sender, receiver].every(Boolean)) {
    throw new ApiError(400, "Please fill in all fields");
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [sender, receiver] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [sender, receiver],
    });
  }

  const newMessage = await Message.create({
    sender,
    receiver,
    message,
  });

  if (newMessage) {
    conversation.messages.push(newMessage);
  }

  await conversation.save();

  const receiverSocketId = getSocketId(receiver);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("new-message", newMessage);
  }

  return res.status(201).json(new ApiResponse(201, newMessage));
});

export const getMessages = catchAsyncError(async (req, res) => {
  const sender = req.user._id;
  const { id: receiver } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  if (![sender, receiver].every(Boolean)) {
    throw new ApiError(400, "Please send both sender and receiver");
  }

  const conversation = await Conversation.findOne({
    participants: { $all: [sender, receiver] },
  }).populate({
    path: "messages",
    options: {
      sort: { createdAt: -1 },
      skip,
      limit: parseInt(limit),
    },
  });

  if (!conversation) return res.status(200).json(new ApiResponse(200, []));

  const messages = conversation.messages;

  res.status(200).json(new ApiResponse(200, messages));
});
