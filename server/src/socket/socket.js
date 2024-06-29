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

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap.set(userId, socket.id);

  socket.emit("online-users", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log("user disconnected with id: ", socket.id);
    userSocketMap.delete(userId);
    socket.emit("online-users", Array.from(userSocketMap.keys()));
  });
});

export { io, server, getSocketId };
