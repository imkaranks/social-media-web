import { getSocketId, io } from "../socket/socket.js";

const emitNotificationEvent = (userId, payload) => {
  const socketId = getSocketId(String(userId));

  if (!socketId) {
    console.error(`Socket ID not found for user ${userId}`);
  } else {
    const socket = io.sockets.sockets.get(socketId);

    if (socket) {
      socket.emit("notification", payload);
    } else {
      console.error(`Socket not found for ID ${socketId}`);
    }
  }
};

export default emitNotificationEvent;
