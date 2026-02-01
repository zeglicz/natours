const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

// mergeParams gets access to /:tourId - POST /tours/6t34t42fs/reviews
// without it we have only access to POST /reviews
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  // TODO: check if user is owner of review than delete
  .delete(authController.protect, reviewController.deleteReview);

module.exports = router;
