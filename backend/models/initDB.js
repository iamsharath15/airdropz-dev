// // models/initDB.js
// import { createUsersTable } from "./createUsersTable.js";

// export async function initializeTables() {
//   try {
//     // Users
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         username VARCHAR(100) UNIQUE NOT NULL,
//         email VARCHAR(100) UNIQUE NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Airdrops
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS airdrops (
//         id SERIAL PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         description TEXT,
//         reward_amount VARCHAR(50),
//         deadline DATE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Tasks
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS tasks (
//         id SERIAL PRIMARY KEY,
//         airdrop_id INTEGER REFERENCES airdrops(id) ON DELETE CASCADE,
//         title VARCHAR(255) NOT NULL,
//         type VARCHAR(50), -- eg: twitter_follow, join_telegram
//         url TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // User_Tasks
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS user_tasks (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
//         completed BOOLEAN DEFAULT FALSE,
//         completed_at TIMESTAMP
//       );
//     `);

//     // Referrals
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS referrals (
//         id SERIAL PRIMARY KEY,
//         referrer_id INTEGER REFERENCES users(id),
//         referred_id INTEGER REFERENCES users(id),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Wallets (optional)
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS wallets (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         address VARCHAR(100) UNIQUE NOT NULL,
//         chain VARCHAR(50), -- e.g. Ethereum, Solana
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     console.log("✅ All tables created (or already exist).");
//   } catch (err) {
//     console.error("❌ Error creating tables:", err);
//   }
// }

import { createUsersTable } from './user.model.js';

export async function initDB() {
  await createUsersTable();
  // You can call other create table functions here if you have more tables
}
