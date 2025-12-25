const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

////////////////////////
// 1. MIDDLE WARES
////////////////////////

app.use(morgan('dev'));

// This is middleware - middle ware is basically just a function that can modify the incoming request data. It's called middleware because it stands between of the request and the response. It's just a step that the request goes through while it's being processed
// In this example is simply that the data from the body is added to it (the request object) by using this middleware
app.use(express.json());

// Serving static files from a folder (not from a route)
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  // DO NOT forget next()
  next();
});

app.use((req, res, next) => {
  req.reqestTime = new Date().toISOString();
  next();
});

////////////////////////
////////////////////////
////////////////////////

// app.get('/', (req, res) => {
//   // Send HTML - default 200, if we don't specify exact status code
//   // res.status(200).send('Hello from the server side!');
//   res.status(200).json({
//     message: 'Hello from the server side!',
//     app: 'Natours',
//   });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint…');
// });

////////////////////////
// 2. ROUTES HANDLERS
////////////////////////

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

// const getAllTours = (req, res) => {
//   console.log(req.reqestTime);
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     requestedAt: req.reqestTime,
//     data: { tours },
//     // data: { tours: tours },
//   });
// };

// const getTour = (req, res) => {
//   // console.log(req.params);
//   const id = Number(req.params.id);
//   const tour = tours.find((t) => t.id === id);

//   if (!tour)
//     return res.status(404).json({
//       status: 'fail',
//       messsage: 'Invalid ID',
//     });
//   // console.log(tour);

//   res.status(200).json({
//     status: 'success',
//     data: { tour },
//   });
// };

// const createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: { tour: newTour },
//       });
//     }
//   );

//   // console.log(req.body);
//   // We always need to send back something in order to finish the so-called request/response cycle
//   // res.send('Done');
// };

// const updateTour = (req, res) => {
//   if (Number(req.params.id) > tours.length)
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated tour here…>',
//     },
//   });
// };

// const deleteTour = (req, res) => {
//   if (Number(req.params.id) > tours.length)
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

// this is exact api url endpoint
// ? question mark make it optional
// app.get('/api/v1/tours/:id/:x/:y?', (req, res) => {
//   console.log(req.params);

//   console.log(req.params);
//   res.status(200).json({ status: 'success' });
// });

// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

////////////////////////
// 3. ROUTES
////////////////////////

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// app.route('/api/v1/tours').get(getAllTours).post(createTour);

// // routes from up end req-res cycle so this doesn't show
// app.use((req, res, next) => {
//   console.log('Hello from the middleware between routes');
//   next();
// });

// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);

// app
//   .route('/api/v1/users/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

////////////////////////
// 4, START SERVER
////////////////////////

// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}…`);
// });

module.exports = app;
