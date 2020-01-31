FROM node:10.16.3

RUN mkdir /app
WORKDIR /app

ADD ./ .
RUN npm install -g ts-node@5.00 typescript@3.2.2 jest tslint nodemon
RUN npm install

