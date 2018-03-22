//Dependencies
let express = require('express');
let router = express.Router();
let db = require('./../models/db');
let nodeMailer = require('nodemailer');
let fs = require('fs');
let ejs = require('ejs');

//Allow CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//
router.use(express.static('src'))

let transport = nodeMailer.createTransport({
  host: "jssverve.org",
  port: 465,
  secure: true,
  tls: {
    rejectUnauthorized:false
  },
  auth: {
    user: 'ticketmaster@jssverve.org',
    pass: '^lT1$vt=Pwki'
  }
})

router.get('/', (req, res, next) => {
  res.send("Working");
});

router.get('/getHomeData', (req, res, next) => {
  db.getSummary((err, success1) => {
    if(err)
      res.status(500).send({err: err, data: null})
    else{
      db.getRecentActivity((err, success2) => {
        if(err){
          console.log(err)
          res.status(500).send({err: err, data: null})
        }
        else
          res.status(200).send({err: null, data: {summary: success1, recentActivity: success2}})
      })
    }
  })
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

router.post('/deallotPasses', (req, res, next) => {
  console.log(req.body);
  db.deallotPasses(req.body.id, (err, success) => {
    if(err){
      console.log(err)
      res.status(500).send({err: err, data: null})
    }
    else
      res.status(200).send({err: null, data: success})
  })
})

router.get('/getAllRecentActivity', (req, res, next) => {
  db.getAllRecentActivity((err, success) => {
    if(err){
      console.log(err)
      res.status(500).send({err: err, data: null})
    }
    else
    res.status(200).send({err: null, data: success})
  })
})

router.post('/addRecentActivity', (req, res, next) => {
  console.log(req.body);
  db.addRecentActivity(req.body, (err, success) => {
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

router.post('/addParticipant', (req, res, next) => {
  console.log(req.body);
  db.addParticipant(req.body, (err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else {
      res.status(200).send({err: null, data: success});
      ejs.renderFile('public/epass.ejs', {
        participantId: success.id,
        name: success.name,
        college: success.college,
        phone: success.phone,
        events: success.eventsRegistered
      }, function(err, html){
        if(err)
          console.log(err)
        else
          transport.sendMail({
            from: 'ticketmaster@jssverve.org',
            to: success.email,
            subject: 'e-Pass for VERVE 2018',
            text: 'Hello Man',
            html: html
          },function(err, success){
              if(err){
                console.log(err)
                //res.status(500).send('Cannot do any thing');
              }
              else
                console.log('Email Sent')
                //res.status(200).send("Msg recieved");
          })
      })
    }
  })
})

router.get('/getParticipants', (req, res, next) => {
  db.getParticipants((err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else {
      res.status(200).send({err: null, data: success});
    }
  })
})

router.post('/getVolunteerParticipants', (req, res, next) => {
  db.getParticipantsByOwner(req.body.id, (err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else {
      res.status(200).send({err: null, data: success});
    }
  })
})

router.post('/getParticipantDetails', (req, res, next) => {
  console.log(req.body);
  db.getParticipantDetails(req.body.id, (err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else {
      res.status(200).send({err: null, data: success});
    }
  })
})

router.post('/validateParticipant', (req, res, next) => {
  console.log(req.body);
  db.validateParticipant(req.body.id, req.body.name, (err, success) => {
    if(err){
      console.log(err)
      res.status(500).send({err: err, data: null});
    }else {
      res.status(200).send({err: null, data: success});
    }
  })
})

router.get('/getEvents', (req, res, next) => {
  db.getEvents((err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else {
      res.status(200).send({err: null, data: success});
    }
  })
})

router.get('/getAllEvents', (req, res, next) => {
  db.getAllEvents((err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else {
      res.status(200).send({err: null, data: success});
    }
  })
})

router.post('/addEvent', (req, res, next) => {
  console.log(req.body);
  db.addEvent(req.body, (err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else {
      res.status(200).send({err: null, data: success});
    }
  })
})

router.post('/getEventById', (req, res, next) => {
  console.log(req.body);
  db.getEventById(req.body.id, (err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else {
      res.status(200).send({err: null, data: success});
    }
  })
})

router.get('/getEventByType/:type', (req, res, next) => {
  console.log(req.params);
  db.getEventByType(req.params.type, (err, success) => {
    if(err)
      res.status(500).send({err: err, data: null});
    else
      res.status(200).send({err: null, data: success});
  })
})

router.post('/modifyEvent', (req, res, next) => {

  //db.modifyEvent(req.body.id, )
})

module.exports = router;
