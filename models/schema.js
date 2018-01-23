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
  passesSold : {type: Number, default: 0},
});

volunteerSchema.methods.genHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

volunteerSchema.methods.compareHash = function(password){
  return bcrypt.compareSync(password, this.password)
}

module.exports = {
  volunteerSchema
}
