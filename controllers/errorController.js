const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFiledsDB = (err) => {
  const message = `Duplicate filed value: ${err.keyValue.name}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join(', ');
  const message = `Invalid input data: ${errors}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again', 401);

const sendErrorDev = (err, req, res) => {
  if (!req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });

  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  const isApi = req.originalUrl.startsWith('/api');

  // Operational = trusted, safe to show message. Else: log and send generic.
  const statusCode = err.isOperational ? err.statusCode : 500;
  const message = err.isOperational
    ? err.message
    : 'Something went very wrong!';

  if (!err.isOperational) console.error('ERROR:', err);

  if (isApi) {
    return res.status(statusCode).json({
      status: err.isOperational ? err.status : 'error',
      message,
    });
  }

  return res.status(statusCode).render('error', {
    title: 'Something went wrong!',
    msg: message,
  });
};

module.exports = (err, req, res, next) => {
  // Stack track is like what happend (error)
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    error.message = err.message;
    // Somehow error don't have name property
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFiledsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

    sendErrorProd(error, req, res);
  }
};
