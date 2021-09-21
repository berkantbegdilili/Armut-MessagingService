FROM node:14.16.0
WORKDIR /usr/armut/messaging-service 
COPY ["package.json", "./"]
RUN npm install
COPY . .