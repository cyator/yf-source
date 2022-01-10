FROM node:alpine

WORKDIR /usr/src/server

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --production

COPY . ./

ENV NODE_ENV=production

USER node

EXPOSE 5000

CMD ["yarn", "start"]