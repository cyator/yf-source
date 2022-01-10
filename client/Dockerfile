# ======= BUILD =========

FROM node:14-alpine3.12 as builder

WORKDIR /usr/src/client

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --production

COPY . ./

ARG BASE_URL
ENV REACT_APP_BASE_URL=${BASE_URL}

RUN yarn build

# ====== RUN =========

FROM caddy:2.4.6-alpine

ARG CADDYFILE
COPY  ${CADDYFILE} /etc/caddy/Caddyfile
COPY --from=builder /usr/src/client/build /srv

EXPOSE 80
EXPOSE 443

