FROM node:8
WORKDIR /app
COPY . /app
RUN npm install
COPY . .
EXPOSE 80
CMD ["node", "server.js"]