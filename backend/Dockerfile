# Use a Node.js LTS image
FROM node:22-slim

# Set the working directory inside the container
WORKDIR /backend

# Copy package files and install dependencies
COPY package*.json /backend
RUN npm install

# Copy the rest of the application code
COPY . /backend

# Expose the port your app listens on
EXPOSE 3001

# Set environment variable
ENV NODE_ENV=development

# Start the application using the start script in package.json
CMD ["npm", "start"]