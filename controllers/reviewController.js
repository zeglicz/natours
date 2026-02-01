const Review = require('../models/reviewModel');

const factory = require('./handleFactory');

const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res) => {
  let filter = {};
  console.log(req.params.tourId);
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(Review.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviews = await features.query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    review: newReview,
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) return next(new AppError('No review found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  // PATCH
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return new updated object
    runValidators: true,
  });

  if (!review) return next(new AppError('No review found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.deleteReview = factory.deleteOne(Review);
