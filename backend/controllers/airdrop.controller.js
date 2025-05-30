import pool from "../config/db.js";

class AirdropController {
  static async createAirdrop(req, res) {
    const { title, short_description, category, banner_image_url, type, content_blocks } = req.body;
    const userId = req.user.userId;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO airdrops (title, short_description, category, banner_image_url, type, created_by)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [title, short_description, category, banner_image_url, type, userId]
      );

      const airdrop = result.rows[0];

      if (Array.isArray(content_blocks) && content_blocks.length) {
        const insertPromises = content_blocks.map(block =>
          client.query(
            `INSERT INTO content_blocks (airdrop_id, type, value, link)
             VALUES ($1, $2, $3, $4)`,
            [airdrop.id, block.type, block.value, block.link || null]
          )
        );
        await Promise.all(insertPromises);
      }

      await client.query('COMMIT');
      res.status(201).json({ message: "Airdrop created successfully", airdrop });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Create Airdrop Error:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      client.release();
    }
  }

  static async updateAirdrop(req, res) {
    const { id } = req.params;
    const { title, short_description, category, banner_image_url, type } = req.body;

    try {
      const result = await pool.query(
        `UPDATE airdrops
         SET title=$1, short_description=$2, category=$3, banner_image_url=$4, type=$5
         WHERE id=$6 RETURNING *`,
        [title, short_description, category, banner_image_url, type, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Airdrop not found" });
      }

      res.json({ message: "Airdrop updated successfully", airdrop: result.rows[0] });
    } catch (error) {
      console.error("Update Airdrop Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteAirdrop(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        `DELETE FROM airdrops WHERE id=$1 RETURNING *`, 
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Airdrop not found" });
      }

      res.json({ message: "Airdrop deleted successfully" });
    } catch (error) {
      console.error("Delete Airdrop Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllAirdrops(req, res) {
    try {
      const query = `
        SELECT a.*,
        COALESCE(json_agg(cb) FILTER (WHERE cb.id IS NOT NULL), '[]') AS content_blocks
        FROM airdrops a
        LEFT JOIN content_blocks cb ON a.id = cb.airdrop_id
        GROUP BY a.id
        ORDER BY a.created_at DESC
      `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Fetch Airdrops Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAirdropById(req, res) {
    const { id } = req.params;

    try {
      const airdropResult = await pool.query(`SELECT * FROM airdrops WHERE id = $1`, [id]);
      if (!airdropResult.rowCount) {
        return res.status(404).json({ error: "Airdrop not found" });
      }

      const contentBlocks = await pool.query(`SELECT * FROM content_blocks WHERE airdrop_id = $1`, [id]);

      res.json({
        ...airdropResult.rows[0],
        content_blocks: contentBlocks.rows,
      });
    } catch (error) {
      console.error("Fetch Airdrop By ID Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createContentBlocks(req, res) {
    const { airdropId } = req.params;
    const { content_blocks } = req.body;

    if (!Array.isArray(content_blocks)) {
      return res.status(400).json({ error: "content_blocks must be an array" });
    }

    const client = await pool.connect();
    try {
      const check = await client.query(`SELECT id FROM airdrops WHERE id = $1`, [airdropId]);
      if (!check.rowCount) return res.status(404).json({ error: "Airdrop not found" });

      await client.query('BEGIN');

      await client.query(`DELETE FROM content_blocks WHERE airdrop_id = $1`, [airdropId]);

      const insertPromises = content_blocks.map(block =>
        client.query(
          `INSERT INTO content_blocks (airdrop_id, type, value, link)
           VALUES ($1, $2, $3, $4)`,
          [airdropId, block.type, block.value, block.link || null]
        )
      );
      await Promise.all(insertPromises);

      await client.query('COMMIT');
      res.status(200).json({ message: "Content blocks created successfully" });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Create Content Blocks Error:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      client.release();
    }
  }

  static async updateContentBlocks(req, res) {
    const { airdropId } = req.params;
    const { content_blocks } = req.body;

    if (!Array.isArray(content_blocks)) {
      return res.status(400).json({ error: "content_blocks must be an array" });
    }

    const client = await pool.connect();
    try {
      const check = await client.query(`SELECT id FROM airdrops WHERE id = $1`, [airdropId]);
      if (!check.rowCount) return res.status(404).json({ error: "Airdrop not found" });

      await client.query("BEGIN");

      const incomingIds = [];

      for (const block of content_blocks) {
        const { id, type, value, link } = block;

        if (id) {
          incomingIds.push(id);
          await client.query(
            `UPDATE content_blocks SET type = $1, value = $2, link = $3
             WHERE id = $4 AND airdrop_id = $5`,
            [type, value, link || null, id, airdropId]
          );
        } else {
          await client.query(
            `INSERT INTO content_blocks (airdrop_id, type, value, link)
             VALUES ($1, $2, $3, $4)`,
            [airdropId, type, value, link || null]
          );
        }
      }

      // Delete blocks that are not included
      await client.query(
        incomingIds.length
          ? `DELETE FROM content_blocks WHERE airdrop_id = $1 AND id NOT IN (${incomingIds.map((_, i) => `$${i + 2}`).join(', ')})`
          : `DELETE FROM content_blocks WHERE airdrop_id = $1`,
        [airdropId, ...incomingIds]
      );

      await client.query("COMMIT");
      res.status(200).json({ message: "Content blocks updated successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Update Content Blocks Error:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      client.release();
    }
  }
}

export default AirdropController;
