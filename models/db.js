//Dependencies
let mongoose = require('mongoose');
let schema = require('./schema');

//Models
let Volunteer = mongoose.model('Volunteer', schema.volunteerSchema);
let RecentActivity = mongoose.model('RecentActivity', schema.recentActivitySchema);
let Participant = mongoose.model('Participant', schema.participantSchema);

//Add new Volunteer (Register user)
let addVolunteer = (data, callback) => {

  Volunteer.findOne({email: data.email}, (err, user) => {
    if(err)
      return callback(err, null);
    else{
      if(user)
        return callback('User Already Registered! Please Login', null);
      else{

        let volunteer = new Volunteer(data);
        volunteer.password = volunteer.genHash(data.password);

        volunteer.save((err, doc) => {
          return callback(err, doc);
        })
      }
    }
  })
}

//Login volunteer
let loginVolunteer = (data, callback) => {
  Volunteer.findOne({userid: data.userid}, (err, user) => {
     if(err)
       return callback(err, null);
     else{
       if(!user)
         return callback('User not found !', null);
       else{
         if(user.compareHash(data.password))
           return callback(null, user)
         else
           return callback('Wrong Password !', null);
       }
     }
   })
}

let addParticipant = (data, callback) => {
  Participant.find({}, (err, success) => {
    if(err)
      callback(err, null);
    else{
      let len = success.length;
      let id = '18VERVE'+getId(len);

      let participant = new Participant(data);
      participant.id = id;

      participant.save((err, doc) => {
        if(err)
          callback(err. null)
        else{
          Volunteer.update(
            {_id: data.ownerid}, 
            {$inc: {passesSold: 1}},
            (err, doc2) => {
              callback(err, doc);
            }
          )
        }
      })
    }
  });
}

let getId = (len) => {
  if(len < 10)
    return '000'+(++len);
  else if(len >= 10 && len < 100)
    return '00'+ (++len);
  else if(len >= 100 && len < 1000)
    return '0'+ (++len);
  else
    return ++len;
}

let getParticipants = (callback) => {
  Participant.find({}, (err, success) => {
    callback(err, success);
  })
}

let getParticipantDetails = (id, callback) => {
  Participant.findOne({id: id}, (err, success) => {
    callback(err, success);
  })
}

// ******   ADMIN FUNCTIONS *********//
//Get all volunteers listen
let getVolunteers = (callback) => {
  Volunteer.find({}, 'name passesSold', (err, success) => {
    callback(err, success);
  })
}

//Get Volunteer Detail
let getVolunteerDetail = (id, callback) => {
  Volunteer.findOne({_id: id}, (err, success) => {
    callback(err, success);
  })
}

//Read Passes Status
let readPassesStatus = (id, callback) => {
  Volunteer.findOne({_id: id}, (err, success) => {
    if(success.passesAlloted > 0)
      callback(true, success.passesAlloted);
    else
      callback(false);
  })
}

//Allot passes
let allotPasses = (data, callback) => {
  Volunteer.update({_id: data.id}, { passesAlloted: parseInt(data.passes) }, (err, success) => {
    callback(err, success);
  })
}

//DeAllot passes
let deallotPasses = (id, callback) => {
  Volunteer.update({_id: id}, {passesAlloted: 0}, (err, success) => {
    callback(err, success);
  })
}

//Get getSummary
let getSummary = (callback) => {
  Volunteer.find({}, (err, success) => {
    let sum1 = 0, sum2=0;
    let index = 0;

    success.forEach(pass => {
      index++;
      sum1 += pass.passesAlloted
      sum2 += pass.passesSold


      if(index == success.length)
        callback(err, {
          totalPassesAlloted: sum1,
          totalPassesSold: sum2,
          totalVolunteersRegistered: success.length
        });
    })
  })
}

//Get RecentActivity for homeScreen
let getRecentActivity = (callback) => {
  RecentActivity
    .find({})
    .sort({'time': -1})
    .limit(5)
    .exec(function(err, docs){
      callback(err, docs);
    })
}

//Get All Activities
let getAllRecentActivity = (callback) => {
  RecentActivity
  .find({})
  .sort({'time': -1})
  .exec((err, docs) => {
    callback(err, docs);
  })
}

//Add All Activities
let addRecentActivity = (data, callback) => {
  let recentActivity = new RecentActivity(data);
  recentActivity.description = getDescription(data);

  recentActivity.save((err, success) => {
    callback(err, success);
  })
}

//Add description
let getDescription = (data) => {
  let description = '';

  switch(data.type){
    case 'REGISTER':
      description = `${data.owner.name} signed up as a Volunteer`;
      break;
    case 'PASS_SOLD':
      description = `${data.owner.name} sold a Pass`;
      break;
    case 'LOGIN':
      description = `${data.owner.name} logged in as a volunteer`;
      break;
    case 'LOGOUT':
      description = `${data.owner.name} logged out !`
      break;
    default:
      description = 'Unidentified Activity';
  }

  return description;
}

//*******  ADMIN FUNCTIONS END *****//

module.exports = {
  addVolunteer,
  loginVolunteer,
  addParticipant,
  getParticipants,
  getParticipantDetails,
  getVolunteers,
  getVolunteerDetail,
  readPassesStatus,
  allotPasses,
  deallotPasses,
  getSummary,
  getRecentActivity,
  getAllRecentActivity,
  addRecentActivity
}
