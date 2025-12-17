# device-backend

Next.js + MongoDB 后端服务，用于 Flutter App 设备管理。

## API 接口

- GET `/api/health` - 健康检查
- POST `/api/device-person` - 添加设备
- GET `/api/device-persons` - 获取所有设备

## 环境变量

- `MONGODB_URI`: MongoDB 连接地址（已在 Vercel 设置）

## 使用方式

部署于 [https://device-backend-five.vercel.app](https://device-backend-five.vercel.app)