const express = require('express');

const tourController = require('./../controllers/tourController');

const router = express.Router();

// PARAM MIDDLEWARE for exact path API (not for all) '/api/v1/tours/:id'
// Each router is like mini sub-application, on for each resource
// router.param('id', (req, res, next, value) => {
//   // var value hold the of the (in this ex.) id parameter
//   console.log(value);
//   next();
// });

router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour); // Chaining middleware

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
