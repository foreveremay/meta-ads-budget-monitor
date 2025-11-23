FROM node:20-slim

# 安裝 OpenSSL (Prisma 需要)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# 建立 server 目錄以適配 Railway 的 "cd server" 命令
WORKDIR /app/server

# -----------------------------------------------------------------------------
# 1. Build Frontend
# -----------------------------------------------------------------------------
# 複製前端依賴
COPY client/package*.json ../client/
RUN cd ../client && npm install

# 複製前端源碼
COPY client/ ../client/

# 構建前端 (設置 VITE_API_URL 為 /api，因為是同源部署)
RUN cd ../client && VITE_API_URL=/api npm run build

# -----------------------------------------------------------------------------
# 2. Build Backend
# -----------------------------------------------------------------------------
# 複製 package.json 和 lock file
COPY server/package*.json ./

# 安裝依賴
RUN npm install

# 複製 Prisma schema 和 migrations
COPY server/prisma/schema.prisma ./prisma/
COPY server/prisma/migrations ./prisma/migrations/

# 生成 Prisma Client
RUN npx prisma generate

# 複製源代碼
COPY server/ .

# 構建 TypeScript
RUN npm run build

# 暴露端口
EXPOSE 3000

# 啟動命令
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
