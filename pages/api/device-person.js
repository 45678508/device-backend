// pages/api/device-person.js
import { connectToDatabase } from '../../lib/db';
import DevicePerson from '../../models/DevicePerson'; // ✅ 唯一需要的导入

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '仅支持 POST 请求' });
  }

  try {
    await connectToDatabase();

    const { name, deviceType, deviceId } = req.body;

    if (!name || !deviceType || !deviceId) {
      return res.status(400).json({ message: '姓名、设备类型和设备ID不能为空' });
    }

    const existing = await DevicePerson.findOne({ deviceId });
    if (existing) {
      return res.status(409).json({ message: '该设备ID已绑定，请勿重复录入' });
    }

    const newRecord = new DevicePerson({
      name,
      deviceType,
      deviceId,
      isOnline: false,
      lastSeen: new Date()
    });

    const saved = await newRecord.save();

    // 安全序列化（推荐方式）
    res.status(201).json(saved.toObject());
    
  } catch (error) {
    console.error('录入失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}