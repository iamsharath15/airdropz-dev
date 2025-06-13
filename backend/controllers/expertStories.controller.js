import pool from '../config/db.js';

class TopRecommendationStoriesController {
  // Create a new cover
  static async createCover(req, res) {
    const { cover_name, cover_image } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO top_recommendations_stories (cover_name, cover_image)
         VALUES ($1, $2)
         RETURNING *`,
        [cover_name, cover_image]
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Error creating cover:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  // Get all covers with their stories
  static async getAll(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          tr.id AS cover_id,
          tr.cover_name,
          tr.cover_image,
          tr.created_at,
          tr.updated_at,
          COALESCE(
            json_agg(
              json_build_object(
                'id', rs.id,
                'image', rs.image,
                'link', rs.link,
                'created_at', rs.created_at
              )
            ) FILTER (WHERE rs.id IS NOT NULL),
            '[]'
          ) AS stories
        FROM top_recommendations_stories tr
        LEFT JOIN recommendation_stories rs
          ON tr.id = rs.top_recommendations_stories_id
        GROUP BY tr.id
        ORDER BY tr.created_at DESC;
      `);

      res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  // Add a story to a cover
  static async addStory(req, res) {
    const { top_recommendations_stories_id, image, link } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO recommendation_stories (top_recommendations_stories_id, image, link)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [top_recommendations_stories_id, image, link]
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Error adding story:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  // Delete a story
  static async deleteStory(req, res) {
    const { storyId } = req.params;

    try {
      await pool.query(
        `DELETE FROM recommendation_stories WHERE id = $1`,
        [storyId]
      );

      res.status(200).json({ success: true, message: 'Story deleted successfully' });
    } catch (err) {
      console.error('Error deleting story:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  // Delete a cover and its stories
  static async deleteCover(req, res) {
    const { coverId } = req.params;

    try {
      await pool.query(
        `DELETE FROM top_recommendations_stories WHERE id = $1`,
        [coverId]
      );

      res.status(200).json({ success: true, message: 'Cover deleted successfully' });
    } catch (err) {
      console.error('Error deleting cover:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
}

export default TopRecommendationStoriesController;
