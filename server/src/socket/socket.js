import { createServer } from "http";
import { Server } from "socket.io";
import app from "../app.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map();

const getSocketId = (userId) => userSocketMap.get(userId);

io.on("connection", (socket) => {
  console.log("user connected with id: ", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected with id: ", socket.id);
  });
});

export { io, server, getSocketId };
