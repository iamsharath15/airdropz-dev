import cors from "cors";

const corsMiddleware = cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000", // replace * with your frontend url
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

export default corsMiddleware;