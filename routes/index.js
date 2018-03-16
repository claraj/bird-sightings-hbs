var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Query to fetch all documents, just get the name fields, sort by name
  Bird.find().select( {name: 1} ).sort( {name: 1} )
    .then( (birdDocs) => {
      console.log('All birds', birdDocs); // for debugging
      res.render('index', {title: 'All Birds', birds: birdDocs} )
    }).catch( (err) => {
      next(err);
    });
});

/* POST create new bird document */
router.post('/addBird', function(req, res, next){

  // Use form data in req.body to create new Bird
  var bird = Bird(req.body);

  // Save the Bird object to DB as new Bird document
  bird.save().then( (birdDoc) => {
    console.log(birdDoc);   // not required, but helps see what's happening
    res.redirect('/');      // create a request to / to load the home page
  }).catch((err) => {

    if (err.name == 'ValidationError') {
      req.flash('error', err.message);
      res.redirect('/');
    }

    else {
      next(err);  // Send errors to the error handlers
    }

  });
});

/* GET info about one bird */
router.get('/bird/:_id', function(req, res, next){
  // Get the _id of the bird from req.params
  // Query DB to get this bird's document
  Bird.findOne( { _id: req.params._id} )
    .then( (birdDoc) => {
      if (birdDoc) {    // If a bird with this id is found
        console.log(birdDoc);  res.render('birdinfo', { title: birdDoc.name, bird: birdDoc } );
      } else {          // else, if bird not found, birdDoc will be undefined, which JS considers to be false
        res.status(404);       // Set status to 404 to indicate not found
        next(Error('Bird not found')); // Invokes 404 error handler
      }
    })
    .catch( (err) => {
      next(err);  // Database errors
    });
});


/* POST a new sighting for a bird */
router.post('/addSighting', function(req, res, next){

  Bird.findOneAndUpdate( { _id: req.body._id }, { $push: { datesSeen: req.body.date } } )
    .then( (updatedBirdDoc ) => {
      if (updatedBirdDoc) {     // If no document matching this query, updatedBirdDoc will be undefined
        res.redirect(`/bird/${req.body._id}`);  // redirect to this bird's info page
      } else {
        res.status(404);
        next(Error("Adding sighting error, bird not found"));
      }
    })
    .catch( (err) => {
      next(err);
    });

});

module.exports = router;
