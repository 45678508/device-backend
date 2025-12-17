// pages/api/ping.js
export default function handler(req, res) {
  // 这行一定会执行！
  console.log("🏓 Pong! Code is running on Vercel!");
  res.status(200).json({ status: "ok", message: "Code is running!" });
}