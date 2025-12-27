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

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}…`);
});
