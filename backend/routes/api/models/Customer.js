const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city:{
    type: String,
    require: true
  },
  store_name: {
    type: String, // or Schema.Types.ObjectId if you have a Store model
    required: true
  },
  createdBy: {
    type: String, // or Schema.Types.ObjectId if you have a User model
    required: true
  },
  updatedBy: {
    type: String // or Schema.Types.ObjectId if you have a User model
  }
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model('Customer', customerSchema);
