FROM node:20-slim

# 安裝 OpenSSL (Prisma 需要)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# 複製 package.json 和 lock file
COPY server/package*.json ./

# 安裝依賴
RUN npm install

# 複製 Prisma schema
COPY server/prisma ./prisma/

# 生成 Prisma Client
RUN npx prisma generate

# 複製源代碼
COPY server/ .

# 構建 TypeScript
RUN npm run build

# 暴露端口
EXPOSE 3000

# 啟動命令
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
