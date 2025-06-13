import express from 'express';
import TopRecommendationStoriesController from '../controllers/expertStories.controller.js';

const router = express.Router();

router.post('/top-recommendations-stories', TopRecommendationStoriesController.createCover);
router.get('/top-recommendations-stories', TopRecommendationStoriesController.getAll);
router.post('/top-recommendations-stories/story', TopRecommendationStoriesController.addStory);
router.delete('/top-recommendations-stories/story/:storyId', TopRecommendationStoriesController.deleteStory);
router.delete('/top-recommendations-stories/:coverId', TopRecommendationStoriesController.deleteCover);

export default router;
