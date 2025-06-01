import express from 'express';
import dotenv from 'dotenv';
import corsMiddleware from './middlewares/corsMiddleware.js';
import authRoutes from './routes/auth.route.js';
import pool from './config/db.js';
import { initDB } from './models/initDB.js';
import referralRoutes from "./routes/referral.routes.js";
import cookieParser from 'cookie-parser';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import airdropRoutes from "./routes/airdrop.routes.js";
import onboardingRoutes from "./routes/onboarding.routes.js";

// import  streakRoutes from './routes/streak.routes.js';

//import onboardingRoutes from "./routes/onboardingRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 8080;
app.use(cookieParser()); 

// Middlewares
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use('/api/auth/v1', authRoutes);
app.use("/api/referral/v1", referralRoutes); 
app.use('/api/leaderboard/v1', leaderboardRoutes)
app.use('/api/airdrop/v1', airdropRoutes)
app.use('/api/onboarding/v1', onboardingRoutes)


// app.use('/api/streak/v1', streakRoutes);

//app.use("/api/onboarding/v1", onboardingRoutes);
// app.use("/api/login", loginStreakRoutes);




// Test DB connection
pool
  .query('SELECT NOW()')
  .then((res) => console.log('🟢 PostgreSQL connected at:', res.rows[0].now))
  .catch((err) => console.error('🔴 DB connection error:', err));

// Error handling middleware
// Create table before starting server
// Testing POSTGRES Connections
// Server running
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB initialization failed:', err);
    process.exit(1); // stop app if DB setup fails
  });
