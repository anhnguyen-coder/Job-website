import cors from "cors";

const allowedOrigins = process.env.ALLOW_ORIGINS
  ? process.env.ALLOW_ORIGINS.split(",").map((o) =>
      o.trim().replace(/^"|"$/g, "")
    )
  : ["http://localhost:5173"];

export const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);
