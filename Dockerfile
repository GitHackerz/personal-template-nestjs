FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci && npm install -g @nestjs/cli
COPY . .
RUN npm run build

FROM node:18-alpine as production

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
