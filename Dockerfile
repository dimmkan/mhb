FROM node:16.16-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install
CMD [ "npm", "run", "start" ]
