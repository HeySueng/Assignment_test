FROM node:latest

LABEL project "OSS Assignment image"
LABEL maintainer "qorgptmd1591@khu.ac.kr"

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

EXPOSE 23013

CMD ["node", "app.js"]
