FROM node:16-alpine
ARG CONFIGFILE=.env1 \
    NODE_ENV=production 
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --${NODE_ENV}
COPY . .
EXPOSE ${PORT}
# COPY "${CONFIGFILE}" ./.env
CMD npm run start