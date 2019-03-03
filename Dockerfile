FROM node:latest

RUN mkdir -p /usr/src/dbexample

WORKDIR /usr/src/dbexample

COPY package.json /usr/src/dbexample/

RUN npm install -no-chache

COPY . /usr/src/dbexample