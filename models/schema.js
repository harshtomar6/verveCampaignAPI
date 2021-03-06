//Dependencies
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let volunteerSchema = mongoose.Schema({
  name : {type: String, required: true},
  email : {type: String, required: true},
  password : {type: String, required: true},
  userid : {type: String, required: true},
  phone: {type: String, required: true},
  passesSold : {type: Number, default: 0, required: true},
  amountCollected: {type: Number, default: 0, required: true}
});

let recentActivitySchema = mongoose.Schema({
  type: {type: String, required: true},
  time: {type: Date, default: Date.now},
  description: {type: String, required: true},
  owner: {
    id: {type: String, required: true},
    name: {type: String, required: true}
  }
})

let concertSchema = mongoose.Schema({
  name: {type: String, required: true, default: 'ARMAN MALIK LIVE'},
  ticket: {type: Number, required: true, default: 250},
  place: {
    day: {type: String, required: true, default: '28th April 2018'},
    time: {type: String, required: true, default: ''},
    venue: {type: String, required: true, default: 'JSSATEB Grounds, JSSATE'}
  },
  participantsRegistered: {type: Number, required: true, default: 0},
  participantsAttended: {type: Number, required: true, default: 0}
})

let concertParticipantSchema = mongoose.Schema({
  id: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: String, required: true},
  college: {type: String, required: true},
  attended: {type: Boolean, default: false},
  price: {type: Number, required: true},
  ownerid: {type: String, required: true}
});

let participantSchema = mongoose.Schema({
  id: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: String, required: true},
  college: {type: String, required: true},
  eventsRegistered: {type: Array, required: true},
  eventsAttended: {type: Array, required: true},
  price: {type: Number, required: true},
  ownerid: {type: String, required: true}
})

let eventSchema = mongoose.Schema({
  name: {type: String, required: true},
  team: {type: String, required: true},
  ticket: {type: Number, required: true},
  type: {type: String, required: true},
  prize: {
    first: {type: Number, required: true},
    second: {type: Number, required: true}
  },
  place:{
    day: {type: String, required: true},
    time: {type: String, required: true},
    venue: {type: String, required: true}
  },
  organisers: {
    name: {type: String, required: true},
    contact: {type: String, required: true}
  },
  participantsRegistered: {type: Number, required: true, default: 0},
  participantsAttended: {type: Number, required: true, default: 0}
})

volunteerSchema.methods.genHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

volunteerSchema.methods.compareHash = function(password){
  return bcrypt.compareSync(password, this.password)
}

module.exports = {
  volunteerSchema,
  recentActivitySchema,
  participantSchema,
  eventSchema,
  concertSchema,
  concertParticipantSchema
}
