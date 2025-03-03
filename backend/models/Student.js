const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['男', '女', '其他'],
    required: true
  },
  class: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  grades: [{
    course: String,
    score: Number,
    semester: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);