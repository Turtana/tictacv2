FROM node:8
WORKDIR /app
COPY . /app
# Install dependencies
RUN npm install
# Expose port
EXPOSE 80
# Launh app
CMD ["npm", "start"]