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
    resaults: tours.length,
    data: { tours },
    // data: { tours: tours },
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

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}…`);
});
