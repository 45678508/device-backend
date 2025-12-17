// models/Record.js
const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  deviceMac: {
    type: String,
    required: true,
    trim: true,
    match: [/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i, 'Invalid MAC address']
  },
  eventType: {
    type: String,
    enum: ['enter', 'exit'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: 'Unknown'
  }
}, {
  collection: 'records', // 指定 MongoDB 集合名
  timestamps: false      // 不自动加 createdAt/updatedAt
});

// 防止重复注册模型（重要！）
module.exports = mongoose.models.Record || mongoose.model('Record', recordSchema);