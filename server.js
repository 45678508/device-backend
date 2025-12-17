// server.js
// server.js —— 第一行必须是：
require('dotenv').config(); // 👈 添加这一行！
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Record = require('./models/Record'); // 确保路径正确
const app = express();

// 允许跨域
app.use(cors());

// 解析 JSON
app.use(express.json());

console.log('🔌 Attempting to connect to MongoDB...');
// MongoDB 连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
})
.catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
  // 可选：进程退出（开发时可注释掉）
  // process.exit(1);
});



// =================== API 路由 ===================

// 1. POST /api/records - 记录进入/离开事件
app.post('/api/records', async (req, res) => {
  try {
    const { name, deviceMac, eventType, location } = req.body;

    if (!name || !deviceMac || !eventType) {
      return res.status(400).json({ error: 'name, deviceMac, eventType are required' });
    }

    const record = new Record({ name, deviceMac, eventType, location });
    await record.save();

    res.status(201).json(record);
  } catch (error) {
    console.error('❌ Error saving record:', error);
    res.status(500).json({ error: 'Failed to save record' });
  }
});

app.get('/api/records', async (req, res) => {
  try {
    console.log('🔎 Executing Record.find()...'); // 👈 新增调试日志
    const records = await Record.find().sort({ timestamp: -1 });
    console.log('✅ Found records:', records.length);
    // 👇 显式设置 Content-Type 包含 charset=utf-8
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(records);
  } catch (error) {
    // 👇 关键：打印完整错误堆栈！
    console.error('💥 FATAL ERROR in Record.find():', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // 返回具体错误给前端（仅开发用）
    res.status(500).json({ 
      error: error.message || 'Unknown query error',
      stack: error.stack // 可选：开发时可保留
    });
  }
});

// 3. GET /api/status - 查询设备当前状态
app.get('/api/status', async (req, res) => {
  try {
    const { deviceMac } = req.query;
    if (!deviceMac) {
      return res.status(400).json({ error: 'deviceMac is required' });
    }

    // 查找最近的两个事件：enter 和 exit
    const recentRecords = await Record.find({ deviceMac })
      .sort({ timestamp: -1 })
      .limit(2);

    if (recentRecords.length === 0) {
      return res.json({ status: 'unknown', lastEvent: null });
    }

    const latest = recentRecords[0];
    const previous = recentRecords[1];

    // 如果最后一个是 enter，且没有后续 exit → 在场
    if (latest.eventType === 'enter') {
      return res.json({
        status: 'present',
        lastEvent: latest,
        nextExpected: 'exit'
      });
    }

    // 如果最后一个是 exit → 不在场
    if (latest.eventType === 'exit') {
      return res.json({
        status: 'absent',
        lastEvent: latest,
        nextExpected: 'enter'
      });
    }

    return res.json({ status: 'unknown', lastEvent: latest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// 默认路由
app.get('/', (req, res) => {
  res.json({ message: 'Device Backend API Running!' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;