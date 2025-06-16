FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:20

WORKDIR /app

COPY --from=builder /app /app

CMD ["node", "index.js"]
