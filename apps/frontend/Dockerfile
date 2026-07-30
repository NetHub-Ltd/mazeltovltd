# ---------- Stage 1: Builder ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy entire project
COPY . .

# Build standalone Next.js app
RUN npm run build


# ---------- Stage 2: Runner ----------
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# 1. Copy prod dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 2. Copy the final build artifacts (the key files needed)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Fix: Use npm start
CMD ["npm", "start"]
