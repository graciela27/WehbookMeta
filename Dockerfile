FROM node:16-alpine
ARG CONFIGFILE=.env \
    NODE_ENV=production \
    PORT=6065

RUN apk --update add ttf-freefont fontconfig && rm -rf /var/cache/apk/*
ENV PHANTOMJS_VERSION=2.1.1
ENV OPENSSL_CONF=/etc/ssl/
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --${NODE_ENV}
COPY . .
EXPOSE ${PORT}
COPY "${CONFIGFILE}" ./.env
CMD npm run start