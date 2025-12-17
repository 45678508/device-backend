// lib/db.js
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  console.log('Connecting to MongoDB...');
  
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // 👇 在这里添加超时设置（关键！）
      connectTimeoutMS: 10000,   // 连接超时：10秒
      socketTimeoutMS: 10000,    // Socket 超时：10秒
      serverSelectionTimeoutMS: 10000, // 服务器选择超时：10秒
      maxIdleTimeMS: 10000,      // 最大空闲时间（可选）
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        console.error('Full error details:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}