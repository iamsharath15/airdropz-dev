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
import weeklyTaskRoutes from "./routes/weeklytask.routes.js";
import userTaskRoutes from "./routes/userTasks.routes.js";
import streakRoutes from './routes/streak.routes.js';
import uploadRoutes from './routes/upload.route.js';
import expertStoriesRoutes from './routes/expertStories.routes.js';
import userAirdropRoutes from './routes/userAirdropRoutes.js';
import adminRoutes from './routes/admin.routes.js';
import notificationRoutes from './routes/notification.routes.js';

import profileRoutes from "./routes/profile.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 8080;
app.use(cookieParser()); 

// Middlewares
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth/v1', authRoutes);
app.use('/api/leaderboard/v1', leaderboardRoutes)
app.use('/api/airdrop/v1', airdropRoutes)
app.use('/api/userAirdrop/v1', userAirdropRoutes)
app.use('/api/weeklytask/v1', weeklyTaskRoutes);
app.use('/api/user-task/v1', userTaskRoutes);
app.use('/api/streak/v1', streakRoutes);
app.use('/api/upload/v1', uploadRoutes);
app.use('/api/expertStories/v1', expertStoriesRoutes);


app.use('/api/admin/v1', adminRoutes);
app.use('/api/notification/v1', notificationRoutes);


//v1
app.use('/api/account-setting/v1', profileRoutes);
app.use("/api/referral/v1", referralRoutes); 



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
