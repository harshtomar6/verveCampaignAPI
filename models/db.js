//Dependencies
let mongoose = require('mongoose');
let schema = require('./schema');

//Models
let Volunteer = mongoose.model('Volunteer', schema.volunteerSchema);
let RecentActivity = mongoose.model('RecentActivity', schema.recentActivitySchema);

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

}

let getTotalPasses = (callback) => {
  Volunteer.find({}, 'passesSold passesAlloted', (err, success) => {
    let sum = 0;
    let index = 0;

    sucess.forEach(pass => {
      index++;
      sum1 += pass.passesAlloted
      sum2 += pass.passesSold

      if(index == success.length)
        callback(err, {
          totalPassesAlloted: sum1,
          totalPassesSold: sum2
        });
    })
  })
}

//Get All Activities
let getRecentActivity = (callback) => {
  RecentActivity.find({}, (err, docs) => {
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
      description = `${data.owner} signed up as a Volunteer`;
      break;
    case 'PASS_SOLD':
      description = `${data.owner} sold a Pass`;
      break;
    case 'LOGIN':
      description = `${data.owner} logged in as a volunteer`;
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
  getVolunteers,
  getVolunteerDetail,
  allotPasses,
  deallotPasses,
  getRecentActivity,
  addRecentActivity
}
