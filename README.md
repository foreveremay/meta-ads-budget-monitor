# Meta 廣告預算監控系統

一個完整的 Meta 廣告帳號預算監控系統，當廣告花費達到設定門檻時，自動發送 LINE 通知。

## 功能特色

- 🔐 **身份驗證**：JWT 登入機制保護後台
- 👥 **客戶管理**：管理多個客戶及其廣告帳號
- 💰 **預算監控**：即時監控廣告花費，自動警報
- 📱 **LINE 通知**：達到門檻時自動發送 LINE 訊息
- 📊 **儀表板**：視覺化顯示所有帳號狀態
- ⚙️ **動態設定**：可在後台配置 API Token

## 技術架構

### 後端
- **框架**：Node.js + Express + TypeScript
- **資料庫**：SQLite + Prisma ORM
- **身份驗證**：JWT + bcrypt
- **排程**：node-cron
- **API**：RESTful API

### 前端
- **框架**：React + TypeScript
- **建置工具**：Vite
- **樣式**：TailwindCSS
- **路由**：React Router
- **圖示**：Lucide React

## 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝步驟

1. **Clone 專案**
```bash
git clone <repository-url>
cd demo
```

2. **安裝後端依賴**
```bash
cd server
npm install
```

3. **設定資料庫**
```bash
npx prisma migrate dev
npx prisma generate
```

4. **安裝前端依賴**
```bash
cd ../client
npm install
```

### 執行開發環境

**啟動後端：**
```bash
cd server
npm run dev
```
後端將運行於 `http://localhost:3000`

**啟動前端：**
```bash
cd client
npm run dev
```
前端將運行於 `http://localhost:5174`

### 預設帳號

- **使用者名稱**：`admin`
- **密碼**：`admin123`

## 使用說明

### 1. 登入系統
訪問 `http://localhost:5174`，使用預設帳號登入。

### 2. 新增客戶
1. 進入「客戶管理」頁面
2. 點擊「新增客戶」
3. 輸入客戶名稱

### 3. 新增廣告帳號
1. 在客戶卡片中點擊「新增帳號」
2. 填寫：
   - 帳號 ID（例：act_123456）
   - 帳號名稱
   - 預算上限
   - 警報門檻（百分比）

### 4. 綁定 LINE 群組
1. 在客戶卡片中點擊「新增 LINE 群組」
2. 填寫：
   - LINE 群組 ID
   - 群組名稱

### 5. 配置 API Token
1. 進入「設定」頁面
2. 輸入：
   - Meta Access Token
   - LINE Channel Access Token
   - 檢查排程（Cron 表達式）

## API 文件

### 身份驗證

**登入**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### 客戶管理

**取得所有客戶**
```bash
GET /api/clients
Authorization: Bearer <token>
```

**新增客戶**
```bash
POST /api/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "客戶名稱"
}
```

### 廣告帳號

**新增廣告帳號**
```bash
POST /api/ad-accounts
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientId": "客戶ID",
  "accountId": "act_123456",
  "name": "帳號名稱",
  "budgetLimit": 10000,
  "thresholdPercent": 20
}
```

### LINE 群組

**新增 LINE 群組**
```bash
POST /api/clients/:clientId/line-groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "groupId": "C1234567890",
  "name": "群組名稱"
}
```

## 資料庫架構

- **Admin**：管理員帳號
- **Client**：客戶資料
- **AdAccount**：廣告帳號
- **LineGroup**：LINE 群組
- **NotificationLog**：通知歷史
- **SystemSetting**：系統設定

## 部署

### 環境變數

建立 `server/.env` 文件：
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3000
```

### 生產環境建置

**後端：**
```bash
cd server
npm run build
npm start
```

**前端：**
```bash
cd client
npm run build
```

## 開發路線圖

- [x] 基礎 MVP 功能
- [x] 身份驗證系統
- [x] 系統設定管理
- [x] LINE 群組綁定
- [ ] 真實 Meta API 串接
- [ ] 真實 LINE API 串接
- [ ] 通知歷史查詢
- [ ] 多管理員支援
- [ ] API Token 加密儲存

## 授權

MIT License

## 聯絡方式

如有問題或建議，歡迎提出 Issue。
