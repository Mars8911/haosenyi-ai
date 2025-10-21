require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// 導入路由
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const workRoutes = require('./routes/works');
const webhookRoutes = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// 確保上傳目錄存在
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 中間件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
    },
  },
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 靜態檔案服務
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 後台管理介面路由
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'login.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'dashboard.html'));
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/works', workRoutes);
app.use('/webhook', webhookRoutes);

// 靜態頁面路由
app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'services.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));
});

app.get('/ai-dev', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'ai-dev.html'));
});

app.get('/app-dev', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'app-dev.html'));
});

app.get('/web-dev', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'web-dev.html'));
});

app.get('/tech-article', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tech-article.html'));
});

app.get('/tech-article01', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tech-article01.html'));
});

app.get('/tech-article02', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tech-article02.html'));
});

app.get('/tech-article03', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tech-article03.html'));
});

app.get('/tech-article04', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tech-article04.html'));
});

app.get('/tech-article05', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tech-article05.html'));
});

app.get('/tech-article06', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tech-article06.html'));
});

// 根路由重定向到首頁
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 錯誤處理中間件
app.use((error, req, res, next) => {
  console.error('伺服器錯誤:', error);
  res.status(500).json({ 
    error: '伺服器內部錯誤',
    message: process.env.NODE_ENV === 'development' ? error.message : '請稍後再試'
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({ error: '找不到請求的資源' });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行在 http://localhost:${PORT}`);
  console.log(`📁 靜態檔案: http://localhost:${PORT}/public`);
  console.log(`🔧 後台管理: http://localhost:${PORT}/admin`);
  console.log(`📡 API 端點: http://localhost:${PORT}/api`);
  console.log(`🔗 Webhook: http://localhost:${PORT}/webhook`);
});

module.exports = app;
