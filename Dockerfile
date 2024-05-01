FROM node:18-alpine AS builder

WORKDIR /app

COPY ./package.json ./package-lock.json ./
COPY .npmrc /root/.npmrc

RUN npm i
COPY src ./src
COPY public ./public
COPY index.html tsconfig.docker.json vite.config.ts ./

COPY .env ./.env

RUN npx tsc -p tsconfig.docker.json && npx vite build

FROM nginx:1.25-alpine AS server

ARG BUILD_DATE
LABEL BUILD_DATE=$BUILD_DATE
ARG VCS_REF
LABEL VCS_REF=$VCS_REF

COPY ./nginx.prod.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./app/dist /usr/share/nginx/html
