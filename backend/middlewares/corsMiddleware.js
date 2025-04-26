import cors from "cors";

const corsMiddleware = cors({
  origin: process.env.CLIENT_URL || "*", // replace * with your frontend url
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;