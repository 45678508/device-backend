// lib/mongodb.js
import mongoose from 'mongoose';

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectToDatabase;