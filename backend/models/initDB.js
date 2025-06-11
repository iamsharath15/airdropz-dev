import { createAirdropsTables } from './airdrops.model.js';
import { createStreaksTables } from './streak.model.js';
import { createLeaderboardTable } from './leaderboard.model.js';
import { createWeeklyTasksTables } from './weeklyTasks.model.js';
import { createReferralsTable } from './referrals.model.js';
import { createUsersTable } from './user.model.js';
import { createUserTasksTable } from './userTasks.model.js';

export async function initDB() {
  console.log('Initializing databse tables...');

  const tableCreators = [
    createUsersTable,
    // createReferralsTable,
    createLeaderboardTable,
    // createStreaksTables,
    // createAirdropsTables,
    // createWeeklyTasksTables,
    // createUserTasksTable,
  ];

  for (const createTable of tableCreators) {
    try {
      await createTable();
    } catch (error) {
      console.error(`Failed to create table: ${createTable.name}`, error);
    }
  }
  console.log('✅ All table creation scripts executed.');
}
