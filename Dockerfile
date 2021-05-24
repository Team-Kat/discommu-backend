FROM node:16.2.0

COPY . /app

WORKDIR /app

RUN ["yarn"]

CMD ["yarn", "start"]
