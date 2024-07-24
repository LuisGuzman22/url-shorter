# Stage 1: Build the app
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the app
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "dist/main"]
