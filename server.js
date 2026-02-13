const dotenv = require('dotenv');

// Uncaught Exceptions are all errors/bugs that occur in our synchronous code but are not handled anywhere
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception 🎉 Shutting down…');

  process.exit(1); // there is sync error so we can terminate server
});

// console.log(x); // this is example of that

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.MONGO_DB.replace(
  '<PASSWORD>',
  process.env.MONGO_DB_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));
// mongoose
//   .connect(DB, {
//     serverSelectionTimeoutMS: 30000, // 30 sekund zamiast domyślnych 10
//     socketTimeoutMS: 45000, // 45 sekund
//   })
//   .then(() => console.log('DB connection successful!'))
//   .catch((err) => {
//     console.error('DB connection error:', err.message);
//     console.log('Unhandled Rejection 🎉 Shutting down…');
//     process.exit(1);
//   });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}…`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection 🎉 Shutting down…');

  // Give the server time to finish all the requests
  server.close(() => {
    process.exit(1); // 0 success, 1 uncaught exception
  });
  // In real life - Restart server now
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});
