# HaoSenYi AI 後台管理系統

這是一個基於 Node.js + Express + Prisma + MySQL 的後台管理系統，用於管理科技文章和作品集。

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境設定

複製環境變數範例檔案：
```bash
cp env.example .env
```

編輯 `.env` 檔案，設定您的資料庫連線和其他環境變數：

```env
DATABASE_URL="mysql://username:password@localhost:3306/haosenyi"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
CORS_ORIGIN="http://localhost:3000"
UPLOAD_DIR="./uploads"
NODE_ENV="development"
```

### 3. 資料庫設定

生成 Prisma 客戶端：
```bash
npm run db:generate
```

推送資料庫結構：
```bash
npm run db:push
```

### 4. 建立種子資料

```bash
npm run db:seed
```

### 5. 啟動伺服器

開發模式：
```bash
npm run dev
```

生產模式：
```bash
npm start
```

## 📁 專案結構

```
haosenyi-ai/
├── src/
│   ├── app.js              # 主應用程式
│   ├── routes/             # API 路由
│   │   ├── auth.js         # 認證路由
│   │   ├── articles.js     # 文章管理
│   │   ├── works.js        # 作品集管理
│   │   └── webhook.js      # Webhook 路由
│   ├── middleware/         # 中間件
│   │   ├── auth.js         # JWT 認證
│   │   └── upload.js       # 檔案上傳
│   └── utils/
│       └── seed.js         # 種子資料
├── admin/                  # 後台管理介面
│   ├── login.html          # 登入頁面
│   └── dashboard.html      # 儀表板
├── public/                 # 靜態網站檔案
├── uploads/                # 上傳檔案目錄
├── prisma/
│   └── schema.prisma       # 資料庫結構
└── package.json
```

## 🔧 API 端點

### 認證
- `POST /api/auth/login` - 管理員登入
- `POST /api/auth/seed-admin` - 建立管理員帳號

### 文章管理
- `GET /api/articles` - 取得文章列表
- `GET /api/articles/:id` - 取得單篇文章
- `POST /api/articles` - 建立文章
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 刪除文章

### 作品集管理
- `GET /api/works` - 取得作品列表
- `GET /api/works/:id` - 取得單個作品
- `POST /api/works` - 建立作品
- `PUT /api/works/:id` - 更新作品
- `DELETE /api/works/:id` - 刪除作品

### Webhook
- `POST /webhook/n8n` - n8n webhook
- `POST /webhook/line` - LINE webhook

## 🎨 後台管理

訪問 `http://localhost:3000/admin` 進入後台管理介面。

預設管理員帳號：
- 使用者名稱：`admin`
- 密碼：`admin123`

## 📊 資料庫模型

### Admin (管理員)
- id, username, email, password, createdAt, updatedAt

### Article (文章)
- id, title, slug, content, coverImage, status, createdAt, updatedAt

### Work (作品)
- id, title, company, type, linkUrl, imageUrl, isFeatured, displayOrder, createdAt, updatedAt

## 🔒 安全功能

- JWT 認證
- 密碼加密 (bcrypt)
- CORS 設定
- Helmet 安全標頭
- 檔案上傳限制

## 📝 開發指令

```bash
npm run dev          # 開發模式
npm start            # 生產模式
npm run db:generate  # 生成 Prisma 客戶端
npm run db:push      # 推送資料庫結構
npm run db:migrate   # 執行資料庫遷移
npm run db:seed      # 建立種子資料
```

## 🌐 部署

1. 設定生產環境變數
2. 建立 MySQL 資料庫
3. 執行資料庫遷移
4. 啟動應用程式

## 📞 支援

如有問題，請聯繫開發團隊。
