FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json

RUN npm ci --omit=dev --workspace server

COPY server ./server

EXPOSE 4000

CMD ["npm", "run", "start", "--workspace", "server"]
