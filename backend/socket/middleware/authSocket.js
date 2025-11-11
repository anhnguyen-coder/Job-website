import jwt from "jsonwebtoken";
import cookie from "cookie";

export function verifySocketAuth(socket, next) {
  try {
    const cookiesHeader = socket.handshake.headers.cookie;
    if (!cookiesHeader) return next(new Error("Unauthorized: no cookie"));

    const cookies = cookie.parse(cookiesHeader);
    const token = cookies.workerToken || cookies.customerToken;
    if (!token) return next(new Error("Unauthorized: no token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: decoded.id, role: decoded.role };

    console.log("✅ Socket connected:", socket.user);
    next();
  } catch (err) {
    console.error("❌ Socket auth error:", err.message);
    next(new Error("Unauthorized"));
  }
}
