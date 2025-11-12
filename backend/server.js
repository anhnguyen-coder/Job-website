import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import http from "http";

import connectDB from "./config/mongodb.js";
import initAppRouter from "./routes/index.routes.js";
import { corsMiddleware } from "./config/cors.js";
import { setupSocket } from "./socket/index.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(corsMiddleware); // ✅ Luôn đứng đầu
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initAppRouter(app);

// Tạo HTTP server
const server = http.createServer(app);
// Gắn socket vào server HTTP (sử dụng cùng port)

// Chỉ listen 1 lần duy nhất
server.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server started on PORT: ${port}`);
});

setupSocket(server);
