const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;



const UserFunctionSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true
    },
    listFunction:  [{ type: Schema.Types.ObjectId, ref: 'Functions' }],
    description: String
});



module.exports = mongoose.model('UserFunction', UserFunctionSchema);
