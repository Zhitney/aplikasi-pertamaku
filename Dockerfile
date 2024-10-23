FROM node:20 AS frontend

WORKDIR /app/frontend

COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY ./frontend ./
RUN pnpm run build

FROM node:20 AS backend

WORKDIR /app/backend

COPY ./backend/package.json ./backend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY ./backend ./

COPY --from=frontend /app/frontend/dist ./public

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]