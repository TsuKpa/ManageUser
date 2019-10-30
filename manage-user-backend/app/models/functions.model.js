const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;



const FunctionsSchema = mongoose.Schema({
    codef: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true
    },
    byRole: [String],
    description: String
});



module.exports = mongoose.model('Functions', FunctionsSchema);
