FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run start

EXPOSE 4000

USER root

CMD npm run start:prod:migrate
