// pages/api/records/post.js
import { connectToDB } from '../../../lib/mongodb';
import Record from '../../../models/Record';

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === 'POST') {
    try {
      const { name, deviceMac, eventType, location } = req.body;
      if (!name || !deviceMac || !eventType) {
        return res.status(400).json({ error: 'name, deviceMac, eventType are required' });
      }

      const record = new Record({ name, deviceMac, eventType, location });
      await record.save();
      return res.status(201).json(record);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save record' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}