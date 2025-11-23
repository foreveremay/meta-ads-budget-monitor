FROM node:20-slim

# 安裝 OpenSSL (Prisma 需要)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# -----------------------------------------------------------------------------
# 1. Build Frontend
# -----------------------------------------------------------------------------
# 複製前端依賴
COPY client/package*.json ./client/
RUN cd client && npm install

# 複製前端源碼
COPY client/ ./client/

# 構建前端 (設置 VITE_API_URL 為 /api，因為是同源部署)
RUN cd client && VITE_API_URL=/api npm run build

# -----------------------------------------------------------------------------
# 2. Build Backend
# -----------------------------------------------------------------------------
# 複製 package.json 和 lock file
COPY server/package*.json ./server/

# 安裝依賴
RUN cd server && npm install

# 複製 Prisma schema 和 migrations
COPY server/prisma/schema.prisma ./server/prisma/
COPY server/prisma/migrations ./server/prisma/migrations/

# 生成 Prisma Client
RUN cd server && npx prisma generate

# 複製源代碼
COPY server/ ./server/

# 構建 TypeScript
RUN cd server && npm run build

# 暴露端口
EXPOSE 3000

# 設定工作目錄為 server (Railway 會執行 cd server)
WORKDIR /app/server

# 啟動命令
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
