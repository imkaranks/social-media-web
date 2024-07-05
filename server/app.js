import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const __dirname = path.resolve();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Serve static files (your frontend build)
app.use(express.static(path.join(__dirname, "client", "dist")));

// Additional CORS headers for OPTIONS requests
app.options("*", cors(corsOptions));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

/* ######### Routers ######### */

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import friendRouter from "./routes/friend.routes.js";
import postRouter from "./routes/post.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import messageRouter from "./routes/message.routes.js";
import healthRouter from "./routes/health.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/friend", friendRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/health", healthRouter);

// Route to serve index.html for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

/* ######### Error Handler ######### */

app.use(errorHandler);

export default app;
