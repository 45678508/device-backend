// models/DevicePerson.js
import mongoose from 'mongoose';

const devicePersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deviceType: { 
    type: String, 
    enum: ['bluetooth', 'wifi'], 
    required: true 
  },
  deviceId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 防止重复注册模型（Vercel 必须）
const DevicePerson = mongoose.models.DevicePerson || mongoose.model('DevicePerson', devicePersonSchema);

export default DevicePerson;