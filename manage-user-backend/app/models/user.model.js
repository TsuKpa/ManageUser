const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    email: {type: String, 
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"], 
      match: [/\S+@\S+\.\S+/, 'is invalid'], 
      index: true
    },
    password: {
      type: String,
      required: true
    },
    
    fullname: String,
    phone: String,
    avatar: String,
    bio: String,
    status: Boolean,
    role: { type: Schema.Types.ObjectId, ref: 'UserFunction' }, 
    functions: [{ type: Schema.Types.ObjectId, ref: 'Functions' }]
}, {
    timestamps: true
});

// hash the password
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    role: this.role,
    exp: parseInt(expiry.getTime() / 1000),
  }, "SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});


module.exports = mongoose.model('User', UserSchema);
