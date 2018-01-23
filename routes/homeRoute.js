//Dependencies
let express = require('express');
let router = express.Router();
let db = require('./../models/db');

//Allow CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', (req, res, next) => {
  res.send("Working");
});

router.get('/getSummary', (req, res, next) => {
  
})

router.get('/getVolunteers', (req, res, next) => {
  db.getVolunteers((err, success) => {
    if(err)
      res.status(500).send({err: err, data: null})
    else
      res.status(200).send({err: null, data: success})
  })
})

router.post('/getVolunteerDetail', (req, res, next) => {
  console.log(req.body);
  db.getVolunteerDetail(req.body.id, (err, success) => {
    if(err)
      res.status(500).send({err: err, data: null})
    else
      res.status(200).send({err: null, data: success})
  })
})

router.post('/allotPasses', (req, res, next) => {
  console.log(req.body);
  db.allotPasses(req.body, (err, success) => {
    if(err){
      console.log(err)
      res.status(500).send({err: err, data: null})
    }
    else
      res.status(200).send({err: null, data: success})
  })
})

router.post('/addVolunteer', (req, res, next) => {
  console.log(req.body)
  db.addVolunteer(req.body, (err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else
      res.status(200).send({err: null, data: success});
  })
})

router.post('/loginVolunteer', (req, res, next) => {
  console.log(req.body)
  db.loginVolunteer(req.body, (err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else {
      res.status(200).send({err: null, data: success});
    }
  })
})

module.exports = router;
