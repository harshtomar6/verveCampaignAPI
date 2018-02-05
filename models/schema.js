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
  event: {type: String, required: true}
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
  participantSchema
}
