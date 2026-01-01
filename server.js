const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.MONGO_DB.replace(
  '<PASSWORD>',
  process.env.MONGO_DB_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}…`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection 🎉 Shutting down');

  // Give the server time to finish all the requests
  server.close(() => {
    process.exit(1); // 0 success, 1 uncaught exception
  });
  // In real life - Restart server now
});
