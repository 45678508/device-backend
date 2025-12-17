// pages/api/device-persons.js
import { connectToDatabase } from '../../lib/db';
import DevicePerson from '../../models/DevicePerson'; // ✅ 唯一需要的导入

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const records = await DevicePerson.find().sort({ createdAt: -1 }).lean();
    const safeRecords = records.map(r => ({
      ...r,
      _id: r._id.toString(),
    }));

    res.status(200).json(safeRecords);
  } catch (error) {
    console.error('查询失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}