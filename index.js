const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

const uri =` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ouwm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

client.connect((err) => {
   const servicesCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection(`${process.env.DB_SERVICES_COLLECTION}`);

   const reviewsCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection(`${process.env.DB_REVIEWS_COLLECTION}`);

   const bookingCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection(`${process.env.DB_BOOKING_COLLECTION}`);

   const adminCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection(`${process.env.DB_ADMIN_COLLECTION}`);

   // Added Services
   app.post('/addServices', (req, res) => {
      const newServices = req.body;
      servicesCollection.insertOne(newServices).then((result) => {
         res.send(result.insertedCount > 0);
      });
   });

   // Delete Services
   app.delete('/services/delete/:id', (req, res) => {
      servicesCollection
         .deleteOne({ _id: ObjectId(req.params.id) })
         .then((result) => {
            res.send(result.deletedCount > 0);
         });
   });

   // All Services
   app.get('/services', (req, res) => {
      servicesCollection.find({}).toArray((err, result) => {
         res.send(result);
      });
   });

   // Added Reviews
   app.post('/addReviews', (req, res) => {
      const newReviews = req.body;
      reviewsCollection.insertOne(newReviews).then((result) => {
         res.send(result.insertedCount > 0);
      });
   });

   // All Reviews
   app.get('/reviews', (req, res) => {
      reviewsCollection.find({}).toArray((err, result) => {
         res.send(result);
      });
   });

   // Added Booking
   app.post('/addBooking', (req, res) => {
      const newBooking = req.body;
      bookingCollection.insertOne(newBooking).then((result) => {
         res.send(result.insertedCount > 0);
      });
   });

   // Find Bookings
   app.get('/bookings', (req, res) => {
      bookingCollection
         .find({ userEmail: req.query.email })
         .toArray((err, result) => {
            res.send(result);
         });
   });

   // Update Bookings Status
   app.patch('/bookingUpdate/:id', (req, res) => {
      bookingCollection
         .updateOne(
            { _id: ObjectId(req.params.id) },
            {
               $set: { bookingStatus: req.body.updateValue },
            }
         )
         .then((result) => {
            res.send(result.matchedCount > 0);
         });
   });

   // Find Bookings
   app.get('/allBookings', (req, res) => {
      bookingCollection.find({}).toArray((err, result) => {
         res.send(result);
      });
   });

   // Added Admin
   app.post('/addAdmin', (req, res) => {
      const newAdmin = req.body;
      adminCollection.insertOne(newAdmin).then((result) => {
         res.send(result.insertedCount > 0);
      });
   });

   // Find Admin
   app.get('/admin', (req, res) => {
      adminCollection
         .find({ email: req.query.email })
         .toArray((err, result) => {
            res.send(result.length > 0);
         });
   });

   err
      ? console.log('Database Connection Fail!')
      : console.log('Database Connection Successfully!');
});

app.get('/', (req, res) => {
   res.send('Hello Express!');
});

app.listen(port, () =>
   console.log(`App listening at http://localhost:${port}`)
);
