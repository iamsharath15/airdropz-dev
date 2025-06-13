import pool from '../config/db.js';

export async function createExpertStories() {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // 1. Create top_recommendations_stories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS top_recommendations_stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cover_name VARCHAR(255) NOT NULL,
        cover_image TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_top_recommendations_stories_id ON top_recommendations_stories(id);
    `);

    // 2. Create recommendation_stories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recommendation_stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        top_recommendations_stories_id UUID REFERENCES top_recommendations_stories(id) ON DELETE CASCADE,
        image TEXT NOT NULL,
        link TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_recommendation_stories_top_id ON recommendation_stories(top_recommendations_stories_id);
    `);

    // 3. Trigger function to auto-update updated_at
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 4. Trigger for top_recommendations_stories
    await pool.query(`
      DROP TRIGGER IF EXISTS set_timestamp_top_recommendations_stories ON top_recommendations_stories;
      CREATE TRIGGER set_timestamp_top_recommendations_stories
      BEFORE UPDATE ON top_recommendations_stories
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `);

    // 5. Trigger for recommendation_stories
    await pool.query(`
      DROP TRIGGER IF EXISTS set_timestamp_recommendation_stories ON recommendation_stories;
      CREATE TRIGGER set_timestamp_recommendation_stories
      BEFORE UPDATE ON recommendation_stories
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `);

    console.log('✅ top_recommendations_stories and recommendation_stories tables created with triggers');
  } catch (error) {
    console.error('❌ Error creating recommendation schema:', error);
    throw error;
  }
}
