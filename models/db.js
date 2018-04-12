//Dependencies
let mongoose = require('mongoose');
let schema = require('./schema');

//Models
let Volunteer = mongoose.model('Volunteer', schema.volunteerSchema);
let RecentActivity = mongoose.model('RecentActivity', schema.recentActivitySchema);
let Participant = mongoose.model('Participant', schema.participantSchema);
let Event = mongoose.model('Event', schema.eventSchema);
let ConcertPaticipant = mongoose.model('ConcertParticipant', schema.concertParticipantSchema);

//Add new Volunteer (Register user)
let addVolunteer = (data, callback) => {

  Volunteer.findOne({userid: data.userid.toUpperCase()}, (err, user) => {
    if(err)
      return callback(err, null);
    else{
      if(user)
        return callback('USN Already Registered! Please Login', null);
      else{

        let volunteer = new Volunteer(data);
        volunteer.userid = data.userid.toUpperCase();
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
  Volunteer.findOne({userid: data.userid.toUpperCase()}, (err, user) => {
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
          callback(err, null)
        else{
          Volunteer.update(
            {_id: data.ownerid},
            {$inc: {passesSold: 1}},
            (err, doc2) => {
              let i=0
              data.eventsRegistered.forEach((event) => {
                Event.update({name: event}, {$inc: {participantsRegistered: 1}}, (err, doc3) => {
                  i++;

                  if(i === data.eventsRegistered.length)
                    callback(err, doc);
                })
              })
            }
          )
        }
      })
    }
  });
}

let getId = (len) => {
  if(len < 9)
    return '000'+(++len);
  else if(len >= 9 && len < 99)
    return '00'+ (++len);
  else if(len >= 99 && len < 999)
    return '0'+ (++len);
  else
    return ++len;
}

let getParticipants = (callback) => {
  Participant.find({}, 'id name eventsRegistered eventsAttended', (err, success) => {
    callback(err, success);
  })
}

let getParticipantsByOwner = (id, callback) => {
  Participant.find({ownerid: id}, (err, success) => {
    callback(err, success)
  })
}

let getParticipantsByEvent = (name, callback) => {
  Participant.find({eventsRegistered: {$elemMatch: {$eq: name}}}, (err, success)=> {
    callback(err, success);
  })
}

let getParticipantDetails = (id, callback) => {
  Participant.findOne({id: id}, (err, success) => {
    callback(err, success);
  })
}

let validateParticipant = (id, eventName, callback) => {
  Participant.findOne({id: id}, (err, doc) => {
    let index = doc.eventsRegistered.indexOf(eventName);
    //doc.eventsRegistered.splice(index, 1);

    if(doc.eventsAttended.includes('none')){
      doc.eventsAttended = [];
      doc.eventsAttended.push(eventName);
    }else
      doc.eventsAttended.push(eventName);

    doc.save((err, success) => {
      if(err)
        return callback(err, null);
      else{
        Event.update({name: eventName}, {$inc: {participantsAttended: 1}}, (err, success2) => {
          callback(err, success2)
        })
      }
    })
  })
}

//Add event
let addEvent = (data, callback) => {
  let event = new Event(data);
  event.save((err ,success) => {
    callback(err, success);
  })
}

//get all events
let getEvents = (callback) => {
  Event.find({name: {$ne: 'ARMAN MALIK LIVE CONCERT'}}, 'name team ticket type', (err, success) => {
    callback(err, success);
  })
}

let getAllEvents = (callback) => {
  Event.find({name: {$ne: 'ARMAN MALIK LIVE CONCERT'}}, (err, success) => {
    callback(err, success);
  })
}

//get event by id
let getEventById = (id, callback) => {
  Event.findOne({_id: id}, (err,success) => {
    callback(err, success);
  })
}

//Get events by Type
let getEventByType = (type, callback) => {
  Event.find({type: type}, (err, success) => {
    callback(err, success);
  })
}

//Modify event
let modifyEvent = (id, data, callback) => {
  Event.update({_id: id}, data, (err, success) => {
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
    if(err)
      callback(err, null);
    else
      if(success){
        Participant.find({ownerid: id},'price', (err, docs) => {
          if(err)
            callback(err, null);
          else{
            let money = 0;
            let i=0;
            console.log(docs.length)
            if(docs.length == 0){
              let data = Object.assign({}, success._doc)
              data['totalMoney'] = money;
              return callback(null, data);
            }
            else
              docs.forEach(doc => {
                i++;
                money += parseInt(doc.price);
                if(i == docs.length){
                  let data = Object.assign({}, success._doc)
                  data['totalMoney'] = money;
                  return callback(null, data);
                }
              })
          }
        })
      }else
        callback(err, null);
  })
}

// Collect Money from volunteer
let collectMoney = (id, amount, callback) => {
  
  Volunteer.update({_id: id}, {$inc: {amountCollected: amount}}, (err, success) => {
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
  Volunteer.find({}, 'passesSold amountCollected', (err, success) => {
    let sum1 = 0, sum2=0, amountCollected=0;
    let index = 0;

    if(success.length == 0)
      return callback(null, {
        totalPassesAlloted: 0,
        totalPassesSold: 0,
        totalVolunteersRegistered: success.length,
        totalAmountCollected: 0
      })
    else
      success.forEach(pass => {
        index++;
        sum2 += pass.passesSold
        amountCollected += pass.amountCollected

        if(index == success.length){
          Participant.find({}, 'price', (err, success2) => {
            if(err)
              callback(err, null);
            else{
              let totalCollection = 0, j=0;
              if(success2.length == 0){
                return callback(null, {
                  totalPassesSold: sum2,
                  totalVolunteersRegistered: success.length,
                  totalCollection: totalCollection,
                  totalParticipants: success2.length,
                  amountCollected: amountCollected
                })
              }else{
                success2.forEach(item => {
                  j++;
                  totalCollection += item.price
                  if(j == success2.length){
                    return callback(null, {
                      totalPassesSold: sum2,
                      totalVolunteersRegistered: success.length,
                      totalCollection: totalCollection,
                      totalParticipants: success2.length,
                      amountCollected: amountCollected
                    })
                  }
                })
              }
            }
          })
        }
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
    case 'VALIDATE':
      description = `${data.owner.name} validated ${data.owner.participant} for ${data.owner.event}`;
      break;
    case 'MONEY_COLLECT':
      description = `Admin collected Rs. ${data.owner.amount} from ${data.owner.name}`
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
  getParticipantsByOwner,
  getParticipantDetails,
  validateParticipant,
  getVolunteers,
  getVolunteerDetail,
  readPassesStatus,
  allotPasses,
  deallotPasses,
  getSummary,
  getRecentActivity,
  getAllRecentActivity,
  addRecentActivity,
  addEvent,
  getEvents,
  getEventById,
  getEventByType,
  getAllEvents,
  modifyEvent,
  getParticipantsByEvent,
  collectMoney
}
