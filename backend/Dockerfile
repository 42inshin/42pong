FROM node:lts-alpine
WORKDIR /server
COPY src src
COPY package*.json ./
COPY .env ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN npm install -g npm@8.19.2
# package.json update
RUN npm install -g npm-check-updates
RUN ncu -u

RUN npm install

ENTRYPOINT npm run start:dev
