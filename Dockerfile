FROM node:12-alpine AS build

ENV NODE_ENV production

RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /airhornbot
COPY package*.json .
COPY yarn.lock .
RUN yarn install --production --pure-lockfile

FROM node:12-alpine AS release

ENV NODE_ENV production

WORKDIR /airhornbot
COPY --from=build /airhornbot/node_modules ./node_modules
COPY package*.json .
COPY lib lib
COPY bot bot
COPY web web
COPY audio audio

EXPOSE 4500

ENTRYPOINT ["yarn", "run"]
