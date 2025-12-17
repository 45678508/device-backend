// models/Record.js
import mongoose from 'mongoose';

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
  collection: 'records',
  timestamps: false
});

// 防止重复注册模型（ESM 写法）
const Record = mongoose.models.Record || mongoose.model('Record', recordSchema);

export default Record;