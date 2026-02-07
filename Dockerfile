FROM node:22-slim AS build

WORKDIR /app

COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm install

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install

COPY . .

RUN cd client && npm run build


FROM node:22-slim

WORKDIR /app

COPY --from=build /app/server ./server

ENV NODE_ENV=production
WORKDIR /app/server

CMD ["node", "index.js"]
