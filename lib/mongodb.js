// lib/mongodb.js
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false,
      // 👇 关键：添加超时配置（适配 Vercel）
      serverSelectionTimeoutMS: 5000, // 5秒内选不出服务器就失败
      connectTimeoutMS: 10000,        // 连接超时 10 秒
      socketTimeoutMS: 10000,         // 套接字超时 10 秒
      maxIdleTimeMS: 10000,           // 连接空闲超时（可选）
     };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e.message);
    throw e;
  }

  return cached.conn;
}