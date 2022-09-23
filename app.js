// GLOBAL
const fs = require('fs');

// EXPRESS
const { application } = require('express');
const express = require('express');
const app = express();

// MIDDLEWARE
app.use(express.json());

// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json(
//             {
//                 message: 'Hello from the server side!',
//                 app: 'Natours'
//             })
// });

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
// });

// Simple tours data variable
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// GET request for simple all tour data
app.get('/api/v1/tours', (req, res) => {
    res
        .status(200)
        .json(
            {
                status: 'success',
                results: tours.length,  // returns the number of results
                data: {
                    tours: tours
                }
            });
 });

//Get request for single tour data
app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params);

    const id = req.params.id * 1; //convert id to number
    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    const tour = tours.find(el => el.id === id); //find tour with id

    res
        .status(200)
        .json(
            {
                status: 'success',
                data: {
                    tour: tour
                }
        }
    )
})

// POST new tour
app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res
                .status(201)
                .json({
                    status: 'success',
                    data: {
                        tour: newTour
            }
        })
    });
 }
)

// PATCH request (only updated properties are given, not the whole object)
app.patch('/api/v1/tours/:id', (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({ status: 'success', data: { tour: '<Updated tour here>' } })
});

// DELETE request
app.delete('/api/v1/tours/:id', (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(204).json({ status: 'success', data: null });
});

// Server Listener
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});
