import cors from "cors";

const allowedOrigins = process.env.ALLOW_ORIGINS
  ? process.env.ALLOW_ORIGINS.split(",").map((o) =>
      o.trim().replace(/^"|"$/g, "")
    )
  : ["http://localhost:5173"];

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);
