//Dependencies
let express = require('express');
let router = express.Router();
let db = require('./../models/db');
let nodeMailer = require('nodemailer');
let request = require('request');
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

let transport2 = nodeMailer.createTransport({
  host: "jssverve.org",
  port: 465,
  secure: true,
  tls: {
    rejectUnauthorized:false
  },
  auth: {
    user: 'contact@jssverve.org',
    pass: 'p,s1nG$dl;~['
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
      // Send E-mail
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
      //Send Text
      let events = success.eventsRegistered.join(', ')
      request.post('https://api.textlocal.in/send/', {form:{
        apiKey: "9mB7hzcNOZQ-LXFiicQcR6bGLLYATJm804efGeYvjW",
        numbers: success.phone,
        message: `Thanks for participating in Verve 2018. Your Participant ID is ${success.id}. You have registered for ${events}. To view your e-pass visit https://jssverve.org/epass.php/${success.id}`
      }}, (err, res, body) => {
        if(err || res.statusCode !== 200)
          console.log('Cannot send Text');
        else{
          console.log('Text Send');
          console.log(body);
        }
      });
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

//Render e-pass
router.get('/epass/:id', (req, res, next) => {
  let id = req.params.id;
  var pat = new RegExp('18VERVE[0-9]{4}$')

  if(pat.test(id)){
  db.getParticipantDetails(id, (err, success) => {
    if(err)
      res.send('Oops.. Some weird thing happened. ! We cannot display your pass');
    else{
      if(success){
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
            res.send(html);
        })
      }else{
        res.status(500).send('Participant not Found');
      }
    }
  })
  }
  else
    res.send('Invalid Participant Id');

})

router.post('/contact', (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let comment = req.body.comment;

  transport2.sendMail({
    from: 'contact@jssverve.org',
    to: 'contact@jssverve.org',
    subject: 'Feedback',
    text: `Hi, \n ${name} send a Feedback. \n Name - ${name} \n email - ${email} \n comments - ${comment} `,
  },function(err, success){
      if(err){
        console.log(err)
        res.status(500).send('Error in sending email');
      }
      else{
        console.log('Email Sent')
        res.status(200).send("Email Sent");
      }
  })
  
})

module.exports = router;
