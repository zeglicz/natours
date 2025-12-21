const fs = require('fs');
const express = require('express');

const app = express();

// This is middleware - middle ware is basically just a function that can modify the incoming request data. It's called middleware because it stands between of the request and the response. It's just a step that the request goes through while it's being processed
// In this example is simply that the data from the body is added to it (the request object) by using this middleware
app.use(express.json());

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
////////////////////////
////////////////////////

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
    // data: { tours: tours },
  });
});

// this is exact api url endpoint
// ? question mark make it optional
// app.get('/api/v1/tours/:id/:x/:y?', (req, res) => {
//   console.log(req.params);

//   console.log(req.params);
//   res.status(200).json({ status: 'success' });
// });

app.get('/api/v1/tours/:id', (req, res) => {
  // console.log(req.params);
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour)
    return res.status(404).json({
      status: 'fail',
      messsage: 'Invalid ID',
    });
  console.log(tour);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );

  // console.log(req.body);
  // We always need to send back something in order to finish the so-called request/response cycle
  // res.send('Done');
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (Number(req.params.id) > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here…>',
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}…`);
});
