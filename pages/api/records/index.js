// pages/api/records/index.js
import { connectToDB } from '../../../lib/mongodb';
import Record from '../../../models/Record';
import Cors from 'cors';

// 初始化 CORS 中间件
const cors = Cors({
  methods: ['GET', 'POST'],
  origin: '*', // 或指定你的前端域名，如 'http://localhost:3001'
});

// 辅助函数：运行中间件
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === 'GET') {
    try {
      const records = await Record.find().sort({ timestamp: -1 });
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).json(records);
    } catch (error) {
      console.error('GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch records' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, deviceMac, eventType, location } = req.body;

      // 基本验证
      if (!name || !deviceMac || !eventType) {
        res.status(400).json({ error: 'Missing required fields' });
        return ;
      }

      const record = new Record({ name, deviceMac, eventType, location });
      await record.save();

      return ;
    } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ error: 'Server error' });
    return;
  }
  }

  // 其他方法不支持
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}