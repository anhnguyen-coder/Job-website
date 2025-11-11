import express, { json } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import http from "http";

import connectDB from "./config/mongodb.js";
import initAppRouter from "./routes/index.routes.js";
import { corsMiddleware } from "./config/cors.js";
import { setupSocket } from "./socket/index.js";

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port);

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

//API Endpoints
initAppRouter(app);

// Socket init
setupSocket(server);
app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
