const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

// prefilling the query string for the user
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILD THE QUERY
    // // 1.a Filtering
    // // eslint-disable-next-line node/no-unsupported-features/es-syntax
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // // const query = await Tour.find({
    // // duration: 5,
    // // difficulty: 'easy',
    // // });

    // // const query = await Tour.find()
    // //   .where('duration')
    // //   .equals(5)
    // //   .where('difficulty')
    // //   .equals('easy');

    // // 1.b Advanced Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // // {difficulty: 'easy', duration: { $gte: 5 }} // mongoDB query
    // // {difficulty: 'easy', duration: { gte: '5' }} // req.query
    // // gte, gt, lte, lt

    // // console.log(req.query, queryObj);
    // let query = Tour.find(JSON.parse(queryStr));

    // // 2. Sorting
    // // console.log(req.query.sort);
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    //   // query = query.sort(`field -${req.query.sort}`);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // // 3. Field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // // 4. Pagination
    // const DEFAULT_PAGE = 1;
    // const DEFAULT_LIMIT_PER_PAGE = 5;

    // // page=2&limit=10, 1-10 (page 1), 11-20 (page 2)
    // // query = query.skip(10).limit(10);

    // const page = Number(req.query.page) || DEFAULT_PAGE;
    // const limitPerPage = Number(req.query.limit) || DEFAULT_LIMIT_PER_PAGE;
    // // const skip = page * limitPerPage - limitPerPage;
    // const skip = (page - 1) * limitPerPage;

    // query = query.skip(skip).limit(limitPerPage);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exists');
    // }

    // EXECUTE THE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    // const tours = await query;
    // query.sort().select().skip().limit()

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // shorthand Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // PATCH
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
