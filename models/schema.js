//Dependencies
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let volunteerSchema = mongoose.Schema({
  name : {type: String, required: true},
  email : {type: String, required: true},
  password : {type: String, required: true},
  userid : {type: String, required: true},
  phone: {type: String, required: true},
  passesAlloted : {type: Number, default: 0},
  passesSold : {type: Number, default: 0}
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
  }
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
  eventSchema
}
