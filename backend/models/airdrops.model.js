import pool from '../config/db.js';

export async function createAirdropsTables() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  const query = `
    CREATE TABLE IF NOT EXISTS airdrops (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      category TEXT,
      preview_image_url TEXT,
      type TEXT,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      airdrops_banner_title TEXT,
      airdrops_banner_description TEXT,
      airdrops_banner_subTitle TEXT,
      airdrops_banner_image TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_airdrops_created_by ON airdrops(created_by);

    CREATE TABLE IF NOT EXISTS content_blocks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      airdrop_id UUID NOT NULL REFERENCES airdrops(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('description', 'image', 'checklist', 'link')),
      value TEXT,
      link TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_content_blocks_airdrop_id ON content_blocks(airdrop_id);
  `;

  await pool.query(query);

  // Create or replace trigger function for updated_at on airdrops
  await pool.query(`
    CREATE OR REPLACE FUNCTION update_airdrop_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE 'plpgsql';

    DROP TRIGGER IF EXISTS set_airdrop_timestamp ON airdrops;
    CREATE TRIGGER set_airdrop_timestamp
    BEFORE UPDATE ON airdrops
    FOR EACH ROW
    EXECUTE PROCEDURE update_airdrop_updated_at_column();
  `);

  // Create or replace trigger function for updated_at on content_blocks
  await pool.query(`
    CREATE OR REPLACE FUNCTION update_content_blocks_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE 'plpgsql';

    DROP TRIGGER IF EXISTS set_content_blocks_timestamp ON content_blocks;
    CREATE TRIGGER set_content_blocks_timestamp
    BEFORE UPDATE ON content_blocks
    FOR EACH ROW
    EXECUTE PROCEDURE update_content_blocks_updated_at_column();
  `);

  console.log(
    '✅ airdrops and content_blocks tables created with timestamps and indexes'
  );
}
