FROM node:8
WORKDIR /app
COPY . /app
# Install dependencies
RUN npm install
# Copy stuff
COPY . .
# Expose port
EXPOSE 80
# Launh app
CMD ["npm", "start"]