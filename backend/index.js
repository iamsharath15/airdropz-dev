import express from "express";
import dotenv from "dotenv";
import corsMiddleware from "./middlewares/corsMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 8080

// Middlewares
app.use(corsMiddleware)
app.use(express.json());

// Routes
// Error handling middleware
// Create table before starting server
// Testing POSTGRES Connections
// Server running 
app.listen(PORT, () => {
  console.log(`Server is running on http:localhost:${PORT}`)
})