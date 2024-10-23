FROM node:22

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

EXPOSE 3000
CMD ["node", "server.js"]