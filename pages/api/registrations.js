// pages/api/registrations.js
import { MongoClient } from 'mongodb';
import Registration from '../../models/Registration';

// MongoDB 连接池（避免重复连接）
let client;
let db;

async function connectDB() {
  if (client) return db;

  const uri = process.env.MONGODB_URI;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db('device-backend'); // 数据库名
  console.log('✅ Connected to MongoDB Atlas');
  return db;
}

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      // 获取所有注册设备
      const registrations = await Registration.find().sort({ registrationDate: -1 });
      res.status(200).json(registrations);
    }

    else if (req.method === 'POST') {
      // 添加新设备
      const { deviceName, deviceId } = req.body;
      if (!deviceName || !deviceId) {
        return res.status(400).json({ error: 'deviceName and deviceId are required' });
      }

      const newReg = new Registration({ deviceName, deviceId });
      await newReg.save();
      res.status(201).json(newReg);
    }

    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}